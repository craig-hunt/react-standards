// Cypress loads this before every spec.
//
// It registers the custom commands that make up tier one of the selector
// hierarchy, and the axe helpers the accessibility specs use. It asserts
// nothing and seeds nothing: a support file that starts asserting becomes a
// place where behavior hides from the specs that depend on it, and a failure
// then reports from a file that names no test.

import 'cypress-axe';

import './commands';
