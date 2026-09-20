// Platform attribute names and values the suite asserts on. Named here for the
// same reason domain strings are: a typo in a literal produces a test that
// passes while checking nothing.

export const AriaAttribute = {
  Invalid: 'aria-invalid',
  Sort: 'aria-sort',
  Pressed: 'aria-pressed',
  Current: 'aria-current',
  DescribedBy: 'aria-describedby',
} as const;

// No None value. ARIA expects aria-sort on the sorted column only, removed and
// reapplied as the sort moves, so the suite asserts the attribute is absent
// from an inactive header rather than that it reads none.
export const AriaValue = {
  True: 'true',
  False: 'false',
  Page: 'page',
  Ascending: 'ascending',
  Descending: 'descending',
} as const;
