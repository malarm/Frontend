// 3rd party libraries
import React from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum'
import { UpdateMaintenancePlanVersionStepsJSON } from '@project/shared/feature-maintenance-plan-versions/types/dtos/update-maintenance-plan-version-steps.dto'
import { withRetriesV2 } from '@project/shared/common/utils/with-retries-v2.util';
import { usePathParamV2 } from '@project/ui';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import toast from '@thor-frontend/common/utils/toast';
import AutoSaveSpinner from '@thor-frontend/features/maintenance-plan-versions/components/auto-save-spinner';
import MaintenancePlanTopNavigation from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-top-navigation';
import { useEditMaintenancePlanVersionAsync } from '@thor-frontend/features/maintenance-plan-versions/queries/edit-maintenance-plan-version';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { usePublishMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-publish-by-id';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import BrandedUpsiteLoadingModal from '@thor-frontend/features/real-estates/modals/branded-loaded-loading.modal';
import PublishMaintenancePlanDoneModal from '@thor-frontend/features/real-estates/modals/publish-maintenance-plan-done.nodal';



type Props = {
  prevBtnUrlPath?: string;
  nextBtnUrlPath?: string;
  hasPublishHandler?: boolean;
  showPreviousBtn?: boolean;
  stepsDto: UpdateMaintenancePlanVersionStepsJSON;
  autoSaving?: boolean;
  nextButtonIsDisabled?: boolean;
  publishButtonIsDisabled?: boolean;
  invitedEmail?: string;
};

const EditMaintenancePlanTopBtns = (props: Props) => {
  // Params
  const [maintenancePlanId] = usePathParamV2('planId');
  const [realEstateId] = usePathParamV2('id');
  const editableMaintenancePlan = useEditableMaintenancePlan(realEstateId);
  const [loading, setLoading] = React.useState(false);
  const [loadingPublish, setLoadingPublish] = React.useState(false);
  const [publishedId, setPublishedId] = React.useState('');
  const [showDoneModal, setShowDoneModal] = React.useState(false);

  // Hooks
  const history = useHistory();
  const updateMaintenancePlanVersion = useEditMaintenancePlanVersionAsync();
  const maintenancePlanQuery = useMaintenancePlanVersions(realEstateId);
  const maintenancePlanVersionById = useMaintenancePlanVersionById(maintenancePlanId);
  const publishMaintenancePlan = usePublishMaintenancePlanVersion();




  // Functions
  const nextHandler = async () => {
    try {
      setLoading(true);
      await updateMaintenancePlanVersion.mutateAsync({
        planId: maintenancePlanId,
        dto: {
          steps: props.stepsDto,
        },
      });
      maintenancePlanVersionById.refetch();

      // adding query params to run animation for checkmark
      navigateToEndUrl(`${props.nextBtnUrlPath}?isPreviousDone=true`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const publishHandler = async () => {
    try {
      // Promise that resolves after 20 seconds
      const delay = new Promise((resolve) => setTimeout(resolve, 20000));
      setLoadingPublish(true);
      const publishRequest = publishMaintenancePlan.mutateAsync({
        maintenancePlanId,
        dto: {
          email: props.invitedEmail,
        },
      });

      const pdfIsGenerated = withRetriesV2(
        () => maintenancePlanVersionById.refetch()
          .then(response => response.data),
        {
          shouldRetry: result => !result.maintenancePlanPDF,
          initialDelay: 3333,
          getDelay(initialDelay) {
            return initialDelay
          },
          retries: 12
        }
      )

      await Promise.all([delay, publishRequest, pdfIsGenerated]);

      setShowDoneModal(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPublish(false);
    }
  };

  const previousHandler = () => {
    navigateToEndUrl(props.prevBtnUrlPath);
  };

  const navigateToEndUrl = (url: string) => {
    const newRoute = history.location.pathname.split('/');
    newRoute.pop();
    newRoute.push(url.replace('/', ''));
    history.push(newRoute.join('/'));
  };

  const topNaviationNameClick = async () => {
    if (!props.nextButtonIsDisabled) {
      if (props.hasPublishHandler) {
        await publishHandler();
      } else {
        await nextHandler();
      }
    }
  }

  return (
    <>
      {/* Modals */}
      <BrandedUpsiteLoadingModal
        isOpen={loadingPublish}
        onRequestClose={() => null}
        text="Udgiver vedigeholdelsesplan"
        publishProgressAddBy={5}
        stall={true}
      />
      <PublishMaintenancePlanDoneModal
        isOpen={showDoneModal}
        confirmHandler={() => null}
        onRequestClose={async () => {
          editableMaintenancePlan.remove();
          setShowDoneModal(false);
          history.push(
            `${ThorPaths.EJENDOMME}/${realEstateId}${ThorSubPaths.MAINTENANCE}`
          );
        }}
        planId={maintenancePlanId}
      />
      {/* Content */}
      <div className="flex justify-between mb-4 mx-8">
        <div className="flex gap-2 items-center">
          <UpsiteButton
            onClick={() =>
              history.push({
                pathname: `${ThorPaths.EJENDOMME}/${realEstateId}${ThorSubPaths.MAINTENANCE}`,
                state: { stay: true },
              })
            }
            type="secondary"
            isLoading={loading}
            className="mr-2"
          ><i className="text-xl ri-arrow-go-back-line" /> Forlad kladde</UpsiteButton>

          {/* Loading Spinner */}
          <AutoSaveSpinner loading={props.autoSaving} />
          {/* Loading Spinner */}
        </div>
        <div className="flex">
          {props.showPreviousBtn && (
            <UpsiteButton
              onClick={previousHandler}
              type="secondary"
              isLoading={loading}
              className="mr-2"
            ><i className="text-xl ri-arrow-left-line" /> Forrige</UpsiteButton>
          )}

          {/* Is the button the 'next' button or 'publish' button */}
          {!props.hasPublishHandler ? (
            <UpsiteButton isDisabled={props.nextButtonIsDisabled === true} onClick={nextHandler} isLoading={loading}> Næste <i className="text-xl ri-arrow-right-line" /></UpsiteButton>
          ) : (
            <UpsiteButton isDisabled={props.publishButtonIsDisabled === true} onClick={publishHandler} isLoading={loading}> Udgiv <i className="text-xl ri-share-box-line" /></UpsiteButton>
          )}
        </div>
      </div>
      {/* Navigation */}
      <MaintenancePlanTopNavigation onNameClick={topNaviationNameClick} />
    </>
  );
};

EditMaintenancePlanTopBtns.defaultProps = {
  hasPublishHandler: false,
  showPreviousBtn: true,
  nextBtnUrlPath: '/',
  prevBtnUrlPath: '/',
};

export default EditMaintenancePlanTopBtns;
