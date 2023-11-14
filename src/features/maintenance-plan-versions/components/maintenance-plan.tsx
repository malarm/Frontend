// 3rd party libraries
import React from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { usePathParamV2 } from '@project/ui/hooks';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import MaintenancePlanGetStarted from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-get-started';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useCloneMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-clone-by-id';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import toast from '@thor-frontend/common/utils/toast';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';



const MaintenancePlan = () => {

  // State
  const [isLoading, setIsLoading] = React.useState(true);

  // Hooks
  const [realEstateId] = usePathParamV2('id');
  const maintenancePlan = useMaintenancePlanVersions(realEstateId);
  const liveMaintenancePlan = useLiveMaintenancePlan(realEstateId);
  const editableMaintenancePlan = useEditableMaintenancePlan(realEstateId);
  const cloneMaintenancePlanVersionAsync = useCloneMaintenancePlanVersion();

  // History
  const history = useHistory();

  React.useEffect(() => {
    if (history.location.state) {
      if (history.location?.state['stay']) {
        setIsLoading(false);
        return;
      }
    }
    // If Has Live Maintenance Plan
    if (liveMaintenancePlan.data) {
      const path = `/ejendomme/${realEstateId}/vedligehold/${liveMaintenancePlan.data._id}${ThorSubPaths.MAINTENANCE_LIVE}`;
      setIsLoading(false);
      history.push(path);
    }

    // If has Editable maintenanceplan and no Live
    if (!liveMaintenancePlan.data && editableMaintenancePlan.data) {
      const path = `/ejendomme/${realEstateId}/vedligehold/${editableMaintenancePlan.data._id}${ThorSubPaths.MAINTENANCE_EDIT}`;
      setIsLoading(false);
      history.push(path);
    }

    setIsLoading(false);
  }, [
    editableMaintenancePlan,
    history,
    liveMaintenancePlan.data,
    realEstateId,
  ]);

  const loading =
    [maintenancePlan, liveMaintenancePlan, editableMaintenancePlan].some(
      (x) => x.status === 'loading'
    ) ||
    cloneMaintenancePlanVersionAsync.isLoading ||
    isLoading;

  const content = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-12">
          <UpsiteLogoLoader />
        </div>
      );
    }

    return (
      <MaintenancePlanGetStarted
        editableMaintenancePlan={editableMaintenancePlan.data}
      />
    );
  };

  return (
    <RealEstateSubPage title={`Vedligeholdelsesplan`}>
      <MaintenancePlanContentWrapper>{content()}</MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlan;
