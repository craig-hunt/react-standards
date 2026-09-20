import { NavLink, Outlet } from 'react-router';

import { AppRoute, ElementId, HashPrefix, LayoutCopy, NavLabel, Surface } from './constants';
import { testId } from './testId';
import { NavTestId } from './testIds';

/**
 * The frame every page renders inside.
 *
 * The landmarks are the point. A navigation element and a main element give a
 * screen-reader user a way to move between regions, and the skip link gives a
 * keyboard user a way past the navigation without tabbing through it on every
 * page. Both are WCAG 2.2 AA requirements that a visual review never surfaces,
 * because neither is visible until it is needed.
 *
 * Test ids arrive through testId() rather than as a written attribute, so the
 * attribute name flows from TEST_ID_ATTRIBUTE to the markup instead of being
 * typed alongside it.
 */
export function Layout() {
  return (
    <div className={Surface.Shell}>
      <a href={`${HashPrefix}${ElementId.MainContent}`} className={Surface.SkipLink}>
        {LayoutCopy.SkipToContent}
      </a>

      <nav {...testId(NavTestId.Container)} className={Surface.Nav}>
        <NavLink to={AppRoute.Tasks} end {...testId(NavTestId.Tasks)} className={Surface.NavLink}>
          {NavLabel.Tasks}
        </NavLink>
        <NavLink to={AppRoute.Signup} {...testId(NavTestId.Signup)} className={Surface.NavLink}>
          {NavLabel.Signup}
        </NavLink>
        <NavLink
          to={AppRoute.Inventory}
          {...testId(NavTestId.Inventory)}
          className={Surface.NavLink}
        >
          {NavLabel.Inventory}
        </NavLink>
      </nav>

      <main id={ElementId.MainContent} className={Surface.Main}>
        <Outlet />
      </main>
    </div>
  );
}
