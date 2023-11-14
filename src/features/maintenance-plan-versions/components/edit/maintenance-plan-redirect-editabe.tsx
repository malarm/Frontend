// 3rd party libraries
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { usePathParamV2 } from '@project/ui';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';



const RedirectEditable = () => {
  // Params
  const [maintenancePlanId] = usePathParamV2('planId');
  // Hooks
  const maintenancePlanVersionById = useMaintenancePlanVersionById(maintenancePlanId);
  // History
  const history = useHistory();


  useEffect(() => {

    if (maintenancePlanVersionById.status === 'loading' || !maintenancePlanVersionById.data) return

    const steps = maintenancePlanVersionById.data.steps;
    let routeToRedirectTo: string = ThorSubPaths.MAINTENANCE_DESCRIPTION;

    if (!steps) return;

    if (steps.isDescriptionConfirmed) {
      routeToRedirectTo = ThorSubPaths.MAINTENANCE_BDK;
    }
    if (steps.isCardsConfirmed) {
      routeToRedirectTo = ThorSubPaths.MAINTENANCE_BUDGET;
    }
    if (steps.isBudgetConfirmed) {
      routeToRedirectTo = ThorSubPaths.MAINTENANCE_CONCLUSION;
    }
    if (steps.isConclusionConfirmed) {
      routeToRedirectTo = ThorSubPaths.MAINTENANCE_PUBLISH;
    }

    history.push(`${history.location.pathname}${routeToRedirectTo}`);
  }, [history, maintenancePlanVersionById.data?.steps, maintenancePlanVersionById.status])


  return (
    <RealEstateSubPage title="Vedligeholdelsesplan">
      <div className="flex justify-center">
        <UpsiteLogoLoader />
      </div>
    </RealEstateSubPage>
  );
};

export default RedirectEditable;
