// 3rd party libraries
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { LiveVersionModalItem } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-versions-modal-item';
import { usePathParamV2 } from '@project/ui';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { MaintenancePlanVersionSummaryJSON } from '@project/shared/feature-maintenance-plan-versions/projections/maintenance-plan-version-summary.projection';
import { BigRadio } from '@project/ui/radio/big-radio'
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import { useCloneMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-clone-by-id';
import toast from '@thor-frontend/common/utils/toast';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useCreateMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/create-maintenance-plan-version';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

const MaintenancePlanLiveUpdateModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');
  // Params
  const [realEstateId] = usePathParamV2('id');
  const [planId] = usePathParamV2('planId');
  // State
  const [startFresh, setStartFresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // Hooks
  const maintenancePlan = useMaintenancePlanVersions(realEstateId);
  const liveMaintenancePlan = useLiveMaintenancePlan(realEstateId);
  const editableMaintenancePlan = useEditableMaintenancePlan(realEstateId);
  const cloneMaintenancePlanVersionAsync = useCloneMaintenancePlanVersion();
  const createMaintenancePlanVersion = useCreateMaintenancePlanVersion();

  const history = useHistory();

  // Functions
  const closeHandler = () => {
    props.onRequestClose();
  };

  const refetchHandler = async () => {
    maintenancePlan.remove();
    liveMaintenancePlan.remove();
    editableMaintenancePlan.remove();
    await maintenancePlan.refetch();
    await liveMaintenancePlan.refetch();
    await editableMaintenancePlan.refetch();
  };

  const getUrlFromResponse = (res) => {
    const url = history.location.pathname.split('/').slice(0, -2);
    url.push(res._id);
    url.push('kladde');
    return url.join('/');
  };

  const submitHandler = async () => {
    setLoading(true);
    // Start Fresh
    if (startFresh) {
      try {
        const res = await createMaintenancePlanVersion.mutateAsync({
          realEstateId: realEstateId,
        });
        await refetchHandler();
        toast.success('Der blev oprettet en frisk ny kladde 👍');
        history.replace(getUrlFromResponse(res));
        props.onRequestClose();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          toast.error(
            'Du har allerede en aktiv kladde. Slet den eller udgiv den inden du laver en kopi af en ny.'
          );
        } else {
          toast.error('Noget gik galt. Den nye kladde blev ikke oprettet.');
        }
      } finally {
        setLoading(false);
      }

      return;
    } else {
      // Start From Existing
      try {
        const res = await cloneMaintenancePlanVersionAsync.mutateAsync(planId);

        await refetchHandler();
        toast.success('Der blev oprettet en ny kladde 👍');
        history.replace(getUrlFromResponse(res));
        props.onRequestClose();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          toast.error(
            'Du har allerede en aktiv kladde. Slet den eller udgiv den inden du laver en kopi af en ny.'
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const newTextDate = (liveMaintenancePlan.data && liveMaintenancePlan.data.publishedAt)
    ? new Date(liveMaintenancePlan.data.publishedAt)
    : new Date();

  // Return
  return (
    <Modal
      isOpen={props.isOpen}
      contentLabel="maintenance-plan-live-update-modal"
      widthClassName="w-[800px]"
      {...props}
    >
      <ModalHeader
        title="Opdater vedligeholdelsesplan"
        onRequestClose={closeHandler}
      />
      <p className="mb-8">
        Vælg hvordan du ønsker at opdatere vedligeholdelsesplanen.
      </p>
      {/* Items */}
      <div className="overflow-y-scroll max-h-96">
        {/* {Start in latest version} */}
        <BigRadio checked={!startFresh} onClick={() => setStartFresh(false)}>
          <div>
            <div className="flex flex-col">
              <p className="text-black">Start i seneste version</p>
              <p className="text-neutral-500 text-sm">
                {formatDate(newTextDate, 'DD-MM-YYYY')}
              </p>
            </div>
          </div>
        </BigRadio>
        {/* {Start from scratch} */}
        <BigRadio checked={startFresh} onClick={() => setStartFresh(true)}>
          <div>
            <div className="flex flex-col">
              <p className="text-black">Start forfra</p>
              <p className="text-neutral-500 text-sm">
                Lav en helt ny vedligeholdelsesplan
              </p>
            </div>
          </div>
        </BigRadio>
      </div>
      {/* Buttons */}
      <ModalTwoButtons
        cancelBtnText="Annuller"
        onRequestClose={closeHandler}
        cancelColor="secondary"
        cancelTextColor="text-neutral-700 "
        btnText="Start opdatering"
        disabled={loading}
        loading={loading}
        confirmHandler={submitHandler}
      />
    </Modal>
  );
};

export default MaintenancePlanLiveUpdateModal;
