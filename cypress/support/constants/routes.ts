// Paths, relative to the configured baseUrl. A page object navigating by
// literal string puts the same path in several files, and a route change then
// breaks tests that name no route.
//
// These drop the file extension the sibling suites carry. Those demo
// applications ship static files, so /signup.html is the path that exists; this
// one routes in the browser, so /signup is. The suites differ here by design,
// which is exactly why each keeps its own routes file.

export const Route = {
  Tasks: '/',
  Signup: '/signup',
  Inventory: '/inventory',
} as const;

// The one target outside this repository. The selector hierarchy documents a
// tier for pages nobody can add attributes to, and demonstrating that tier
// honestly requires exactly one such page.
export const EXTERNAL_TIER_THREE_URL = 'https://example.com/';
