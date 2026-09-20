// The same rule the C# analyzer enforces, applied to TypeScript: a literal
// carrying meaning belongs in a named constant. MasterAgenda.Analyzers walks the
// syntax tree during compilation and fails the build; this gives the client the
// identical guarantee through ESLint.
//
// Extracted from the AgentDispatch UI rather than rewritten, so two React
// applications enforce one rule with one set of exemptions. DEMO-13 consumes
// this file rather than carrying a third copy.

const RULE_MESSAGE_ID = 'magicLiteral';
const RULE_MESSAGE = 'Literal {{value}} belongs in a named constant in a constants file.';
const CONSTANTS_FILE_PATTERN = /(^|[\\/])constants(\.test)?\.(ts|tsx|js|mjs)$/;
// Both suffixes, because a Cypress spec names its cases the same way a unit
// test does and for the same reason: the sentence is the report a failure
// prints. Naming it as a constant would say the same thing twice and leave the
// two free to disagree.
const TEST_FILE_PATTERN = /\.(test|cy)\.(ts|tsx|js|mjs)$/;
const TRIVIAL_VALUES = new Set(['', 0, 1]);
const TEST_NAMING_CALLEES = new Set(['describe', 'it', 'test']);
// A module mock names a module, exactly as an import specifier does, which the
// rule already exempts below. It cannot move into a constant even in principle:
// vitest hoists these calls above the imports, so the path has to stay a
// literal for the hoist to resolve it. Named methods rather than every vi call,
// because vi.stubGlobal takes an ordinary value the rule should still catch.
const MODULE_MOCK_OBJECT = 'vi';
const MODULE_MOCK_METHODS = new Set(['mock', 'doMock', 'unmock', 'doUnmock']);
const STYLING_CALLEES = new Set(['cx']);
const PRESENTATIONAL_ATTRIBUTES = new Set([
  'className',
  'type',
  'role',
  'autoComplete',
  'inputMode',
  'scope',
  'rel',
  'target',
  'method',
  'lang',
  'dir',
]);
const PROGRAM = 'Program';
const CONST_KIND = 'const';

function ancestorsOf(context, node) {
  return context.sourceCode.getAncestors(node);
}

// A module constant names its value, but markup or a function body inside that
// constant is ordinary code again, so the exemption stops at those boundaries.
const CONSTANT_BOUNDARIES = new Set([
  'JSXElement',
  'JSXFragment',
  'ArrowFunctionExpression',
  'FunctionExpression',
]);

function insideModuleConstant(ancestors) {
  const declarationIndex = ancestors.findIndex(
    (ancestor) => ancestor.type === 'VariableDeclaration' && ancestor.kind === CONST_KIND
  );
  if (declarationIndex < 0) {
    return false;
  }
  const parent = ancestors[declarationIndex - 1];
  const grandparent = ancestors[declarationIndex - 2];
  const atModuleScope =
    parent?.type === PROGRAM ||
    (parent?.type === 'ExportNamedDeclaration' && grandparent?.type === PROGRAM);
  return (
    atModuleScope &&
    !ancestors.slice(declarationIndex).some((ancestor) => CONSTANT_BOUNDARIES.has(ancestor.type))
  );
}

function insideTypePosition(ancestors) {
  return ancestors.some(
    (ancestor) =>
      ancestor.type === 'TSLiteralType' ||
      ancestor.type === 'TSEnumMember' ||
      ancestor.type === 'TSTypeAnnotation' ||
      ancestor.type === 'TSTypeAliasDeclaration' ||
      ancestor.type === 'TSInterfaceDeclaration'
  );
}

function insideModuleSource(ancestors) {
  return ancestors.some(
    (ancestor) =>
      ancestor.type === 'ImportDeclaration' ||
      ancestor.type === 'ExportAllDeclaration' ||
      ancestor.type === 'ImportExpression' ||
      (ancestor.type === 'ExportNamedDeclaration' && ancestor.source !== null)
  );
}

function isModuleMockPath(node, parent, filename) {
  if (!TEST_FILE_PATTERN.test(filename) || parent?.type !== 'CallExpression') {
    return false;
  }
  const callee = parent.callee;
  return (
    parent.arguments[0] === node &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === MODULE_MOCK_OBJECT &&
    callee.property.type === 'Identifier' &&
    MODULE_MOCK_METHODS.has(callee.property.name)
  );
}

function calleeName(call) {
  if (call.callee.type === 'Identifier') {
    return call.callee.name;
  }
  if (call.callee.type === 'MemberExpression' && call.callee.object.type === 'Identifier') {
    return call.callee.object.name;
  }
  return '';
}

function isTestName(node, parent, filename) {
  return (
    TEST_FILE_PATTERN.test(filename) &&
    parent?.type === 'CallExpression' &&
    parent.arguments[0] === node &&
    TEST_NAMING_CALLEES.has(calleeName(parent))
  );
}

function isStylingArgument(ancestors) {
  return ancestors.some(
    (ancestor) => ancestor.type === 'CallExpression' && STYLING_CALLEES.has(calleeName(ancestor))
  );
}

function isPresentationalAttribute(ancestors) {
  const attribute = ancestors.findLast((ancestor) => ancestor.type === 'JSXAttribute');
  return attribute !== undefined && PRESENTATIONAL_ATTRIBUTES.has(attribute.name.name);
}

function isDirective(parent) {
  return parent?.type === 'ExpressionStatement' && typeof parent.directive === 'string';
}

function permitted(context, node) {
  const filename = context.filename;
  if (CONSTANTS_FILE_PATTERN.test(filename)) {
    return true;
  }
  const ancestors = ancestorsOf(context, node);
  const parent = ancestors[ancestors.length - 1];
  return (
    insideModuleConstant(ancestors) ||
    insideTypePosition(ancestors) ||
    insideModuleSource(ancestors) ||
    isModuleMockPath(node, parent, filename) ||
    isTestName(node, parent, filename) ||
    isStylingArgument(ancestors) ||
    isPresentationalAttribute(ancestors) ||
    isDirective(parent)
  );
}

const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require meaningful literals to live in named constants' },
    messages: { [RULE_MESSAGE_ID]: RULE_MESSAGE },
    schema: [],
  },
  create(context) {
    function check(node, value, display) {
      if (TRIVIAL_VALUES.has(value) || permitted(context, node)) {
        return;
      }
      context.report({ node, messageId: RULE_MESSAGE_ID, data: { value: display } });
    }

    return {
      Literal(node) {
        if (node.value === null || typeof node.value === 'boolean') {
          return;
        }
        check(node, node.value, node.raw);
      },
      TemplateElement(node) {
        const text = node.value.cooked ?? '';
        if (text.trim() === '') {
          return;
        }
        check(node, text, JSON.stringify(text));
      },
      JSXText(node) {
        const text = node.value.trim();
        if (text === '') {
          return;
        }
        check(node, text, JSON.stringify(text));
      },
    };
  },
};

export default {
  rules: { 'no-magic-literals': rule },
};
