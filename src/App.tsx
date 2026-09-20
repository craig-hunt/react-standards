import { Route, Routes } from 'react-router';

import { InventoryPage } from './features/inventory/InventoryPage';
import { SignupPage } from './features/signup/SignupPage';
import { TasksPage } from './features/tasks/TasksPage';
import { Layout } from './shared/Layout';
import { AppRoute } from './shared/constants';

/**
 * The route table, and nothing else.
 *
 * Keeping it to routing means a reader can learn what pages exist without
 * reading past anything, and a page can be moved without touching logic that
 * happened to share the file.
 */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={AppRoute.Tasks} element={<TasksPage />} />
        <Route path={AppRoute.Signup} element={<SignupPage />} />
        <Route path={AppRoute.Inventory} element={<InventoryPage />} />
      </Route>
    </Routes>
  );
}
