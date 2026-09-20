// Platform names the suite uses to walk the DOM, as opposed to the domain
// values in testData.ts and the ARIA names in aria.ts.
//
// The selector hierarchy permits structure only where nothing better exists,
// and the tier-two test is exactly that case: it follows a label to the control
// it names, which means naming the label element and the for attribute.

export const LABEL_ELEMENT = 'label';

export const FOR_ATTRIBUTE = 'for';

/** jQuery's attribute reader, which cy.invoke calls by name. */
export const ATTRIBUTE_METHOD = 'attr';

/** What an id selector opens with, so the query is built rather than typed. */
export const ID_PREFIX = '#';
