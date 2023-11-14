// 3rd party libraries
import { FC } from 'react';

// Workspace libraries
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import MaintenancePlanSingleBDK from '@thor-frontend/features/real-estate-cards/components/maintenance-plan-single-bdk';
import EnergyLevel from '@thor-frontend/features/real-estates/sub-pages/energy-label';
import BbrData from '@thor-frontend/features/real-estates/sub-pages/bbr-data';
import Overblik from '@thor-frontend/features/real-estates/sub-pages/overblik';
import Reports from '@thor-frontend/features/real-estates/sub-pages/reports';
import MaintenancePlan from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan';
import MaintenancePlanBDK from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-bdk';
import MaintenancePlanBudget from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-budget';
import MaintenancePlanConclusion from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-conclusion';
import MaintenancePlanDescription from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-description';
import RedirectEditable from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-redirect-editabe';
import { MaintenancePlanLive } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live';
import MaintenancePlanPublish from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-publish';



export type IRealEstateSubRoute = {
  path: string;
  component: FC;
  hideInSidebar?: boolean;
  header?: string;
  icon?: string;
  isDisabled?: boolean;
  disabledTooltip?: string;
};

export const RealEstateSubRoutes: IRealEstateSubRoute[] = [
  {
    path: '/overblik',
    header: 'Overblik',
    component: Overblik,
    icon: 'ri-pie-chart-line',
  },
  {
    path: ThorSubPaths.MAINTENANCE,
    header: 'Vedligehold',
    component: MaintenancePlan,
    icon: 'ri-stack-line',
  },
  {
    path: ThorSubPaths.MAINTENANCE + '/:planId',
    header: 'Vedligehold',
    component: MaintenancePlan,
    icon: 'ri-stack-line',
    hideInSidebar: true,
  },
  {
    path: ThorSubPaths.MAINTENANCE + '/:planId' + ThorSubPaths.MAINTENANCE_EDIT,
    header: 'Vedligehold',
    component: RedirectEditable,
    hideInSidebar: true,
  },
  {
    path: ThorSubPaths.MAINTENANCE + '/:planId' + ThorSubPaths.MAINTENANCE_LIVE,
    header: 'Vedligehold',
    component: MaintenancePlanLive,
    hideInSidebar: true,
  },
  // Vedligehold Sub Routes
  // Description
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_DESCRIPTION,
    component: MaintenancePlanDescription,
    hideInSidebar: true,
  },
  // BDK
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_BDK,
    component: MaintenancePlanBDK,
    hideInSidebar: true,
  },
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_BDK +
      '/:bdkId',
    component: MaintenancePlanSingleBDK,
    hideInSidebar: true,
  },
  // BUDGET
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_BUDGET,
    component: MaintenancePlanBudget,
    hideInSidebar: true,
  },
  // Conclusion
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_CONCLUSION,
    component: MaintenancePlanConclusion,
    hideInSidebar: true,
  },
  {
    path:
      ThorSubPaths.MAINTENANCE +
      '/:planId' +
      ThorSubPaths.MAINTENANCE_EDIT +
      ThorSubPaths.MAINTENANCE_PUBLISH,
    component: MaintenancePlanPublish,
    hideInSidebar: true,
  },
  // Vedligehold Sub Routes Done
  {
    path: '/energimaerke',
    header: 'Energimærke',
    component: EnergyLevel,
    icon: 'ri-seedling-line',
    isDisabled: true,
    disabledTooltip: 'Kommer snart'
  },
  {
    path: '/stamdata',
    header: 'Stamdata',
    component: BbrData,
    icon: 'ri-map-2-line',
  },

  {
    path: '/rapporter',
    header: 'Rapporter',
    component: Reports,
    icon: 'ri-file-list-2-line',
  },
];
