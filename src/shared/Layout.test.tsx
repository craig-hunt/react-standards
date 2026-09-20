import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Layout } from './Layout';
import {
  AppRoute,
  AriaAttribute,
  AriaRole,
  AriaValue,
  ElementId,
  HashPrefix,
  HtmlAttribute,
  LayoutCopy,
  NavLabel,
} from './constants';
import { NavTestId } from './testIds';
import { renderWithProviders } from '../test/render';

describe('Layout', () => {
  it('exposes a navigation landmark', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByRole(AriaRole.Navigation)).toBeInTheDocument();
  });

  it('exposes a main landmark for the skip link to reach', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByRole(AriaRole.Main)).toHaveAttribute(
      HtmlAttribute.Id,
      ElementId.MainContent
    );
  });

  it('offers a skip link that targets the main landmark', () => {
    // Invisible until focused, which is why a visual review never surfaces it
    // and why it needs a test rather than an eye.
    renderWithProviders(<Layout />);

    expect(screen.getByRole(AriaRole.Link, { name: LayoutCopy.SkipToContent })).toHaveAttribute(
      HtmlAttribute.Href,
      `${HashPrefix}${ElementId.MainContent}`
    );
  });

  it('links to every page', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByTestId(NavTestId.Tasks)).toHaveAttribute(HtmlAttribute.Href, AppRoute.Tasks);
    expect(screen.getByTestId(NavTestId.Signup)).toHaveAttribute(
      HtmlAttribute.Href,
      AppRoute.Signup
    );
    expect(screen.getByTestId(NavTestId.Inventory)).toHaveAttribute(
      HtmlAttribute.Href,
      AppRoute.Inventory
    );
  });

  it('marks the current page for assistive technology', () => {
    // aria-current is what tells a screen-reader user which page they are on.
    // Styling the active link alone conveys it to sighted users only.
    renderWithProviders(<Layout />, { route: AppRoute.Inventory });

    expect(screen.getByRole(AriaRole.Link, { name: NavLabel.Inventory })).toHaveAttribute(
      AriaAttribute.Current,
      AriaValue.Page
    );
  });
});
