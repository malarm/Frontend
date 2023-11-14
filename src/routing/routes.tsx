// 3rd party libraries
import React from 'react';
import { Redirect } from 'react-router-dom';

// Workspace libraries
import Login from '@thor-frontend/features/login/login.page';
import Dashboard from '@thor-frontend/features/dashboard/dashboard.page';
import { ActivateUserPage } from '@thor-frontend/features/activation/activate-user.page';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { RealEstatesPage } from '@thor-frontend/features/real-estates/real-estates.page';
import { RealEstateSubRoutes } from '@thor-frontend/features/real-estates/real-estate-sub-routes';
import { OrganizationSettingsSubRoutes } from '@thor-frontend/features/organization-settings/organizations-settings-sub-routes';
import TaskManager from '@thor-frontend/features/task-manager/task-manager';
import Economy from '@thor-frontend/features/economy/economy';
import OrganizationSettings from '@thor-frontend/features/organization-settings/organizations-settings.page';
import { MaintenancePlanVersionPrintable } from '@thor-frontend/features/maintenance-plan-versions/pages/maintenance-plan-version-printable';



interface RouteOptions {
  path: string;
  component: React.FC;
  isPrivate?: boolean;
  exact?: boolean;
  disabled?: boolean;
}

const routes: RouteOptions[] = [
  {
    path: ThorPaths.LOGIN,
    component: Login,
    isPrivate: false,
    exact: true,
  },
  {
    path: ThorPaths.ACTIVATE,
    component: ActivateUserPage,
    isPrivate: false,
    exact: true,
  },
  {
    path: ThorPaths.HOME,
    component: () => <Redirect to={ThorPaths.PROPERTY} />,
    isPrivate: true,
    exact: true,
  },
  // {
  //   path: ThorPaths.DASHBORD,
  //   component: Dashboard,
  //   isPrivate: true,
  //   exact: true,
  // },
  {
    path: ThorPaths.PROPERTY,
    component: RealEstatesPage,
    isPrivate: true,
    exact: true,
  },
  {
    path: ThorPaths.ECONOMY,
    component: Economy,
    isPrivate: true,
    exact: true,
    disabled: true,
  },
  {
    path: ThorPaths.SETTINGS,
    component: OrganizationSettings,
    isPrivate: true,
    exact: true,
  },

  {
    path: '/*',
    component: () => <p>404</p>,
    isPrivate: true,
  },
];

export default routes;
