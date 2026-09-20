import { NavLink, Outlet } from 'react-router';

import { AppRoute, ElementId, HashPrefix, LayoutCopy, NavLabel, Surface } from './constants';
import { NavTestId } from './testIds';

/**
 * The frame every page renders inside.
 *
 * The landmarks are the point. A navigation element and a main element give a
 * screen-reader user a way to move between regions, and the skip link gives a
 * keyboard user a way past the navigation without tabbing through it on every
 * page. Both are WCAG 2.2 AA requirements that a visual review never surfaces,
 * because neither is visible until it is needed.
 */
export function Layout() {
  return (
    <div className={Surface.Shell}>
      <a href={`${HashPrefix}${ElementId.MainContent}`} className={Surface.SkipLink}>
        {LayoutCopy.SkipToContent}
      </a>

      <nav data-testid={NavTestId.Container} className={Surface.Nav}>
        <NavLink to={AppRoute.Tasks} end data-testid={NavTestId.Tasks} className={Surface.NavLink}>
          {NavLabel.Tasks}
        </NavLink>
        <NavLink to={AppRoute.Signup} data-testid={NavTestId.Signup} className={Surface.NavLink}>
          {NavLabel.Signup}
        </NavLink>
        <NavLink
          to={AppRoute.Inventory}
          data-testid={NavTestId.Inventory}
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
