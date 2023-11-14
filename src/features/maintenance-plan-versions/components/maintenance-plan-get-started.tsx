// 3rd party libraries
import React from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { IconsUpsiteSymbol } from '@thor-frontend/assets/svg';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { usePathParamV2 } from '@project/ui';
import { useCreateMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/create-maintenance-plan-version';
import toast from '@thor-frontend/common/utils/toast';
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';



interface Props {
  editableMaintenancePlan?: MaintenancePlanVersionJSON;
}

const MaintenancePlanGetStarted = (props: Props) => {
  const [realEstateId] = usePathParamV2('id');
  // Hooks
  const history = useHistory();
  const createMaintenancePlanVersion = useCreateMaintenancePlanVersion();

  // Functions
  const submitHandler = async () => {
    if (props.editableMaintenancePlan) {
      history.push(
        `${history.location.pathname}/${props.editableMaintenancePlan._id}${ThorSubPaths.MAINTENANCE_EDIT}`
      );
      return;
    }
    try {
      await createMaintenancePlanVersion.mutateAsync({
        realEstateId: realEstateId,
      });
      toast.success('Success');
    } catch (err) {
      console.log(err);
      toast.error('Der opstod en uventet fejl.');
    }
  };

  return (
    <div className="h-[328px] bg-mortar rounded-xl flex justify-between">
      {/* Content */}
      <div className="w-3/5 max-w-2xl p-14 pr-4">
        <p className="text-2xl mb-4">Opret vedligeholdelsesplan</p>
        <div className="flex mb-4">
          <div className="bg-purple mr-2 rounded h-6 w-6 flex justify-center pt-1">
            <IconsUpsiteSymbol height={16} />
          </div>
          <p className="text-xs font-medium mt-1">Powered by UpsiteAI</p>
        </div>
        <p className="text-base mb-4">
          Lav en vedligeholdelsesplan fra A-Z og få økonomisk overblik samt
          actionplan på alle ejendommens byggeopgaver og
          vedligeholdelseudgifter.
        </p>
        <UpsiteButton onClick={() => submitHandler()}>{props.editableMaintenancePlan ? 'Kom i gang' : 'Start nu'}</UpsiteButton>
      </div>
      <div className="mr-4 w-2/5">
        <img
          className="w-full h-full"
          alt="opret-vp-illustration"
          src="assets/images/vp-create.png"
        />
      </div>
    </div>
  );
};

MaintenancePlanGetStarted.defaultProps = {
  editableMaintenancePlan: null,
};

export default MaintenancePlanGetStarted;
