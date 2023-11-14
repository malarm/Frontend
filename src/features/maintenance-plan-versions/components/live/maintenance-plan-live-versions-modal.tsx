// 3rd party libraries
import React from 'react';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { LiveVersionModalItem } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-versions-modal-item';
import { usePathParamV2 } from '@project/ui';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { MaintenancePlanVersionSummaryJSON } from '@project/shared/feature-maintenance-plan-versions/projections/maintenance-plan-version-summary.projection';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

const MaintenancePlanLiveVersionsModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');
  // Params
  const [realEstateId] = usePathParamV2('id');
  const [maintenancePlanId] = usePathParamV2('planId');
  // Hooks
  const maintenancePlans = useMaintenancePlanVersions(realEstateId);
  const history = useHistory();
  const maintenancePlan = useMaintenancePlanVersionById(maintenancePlanId);

  // State
  const [selectedMaintenancePlan, setSelectedMaintenancePlan] =
    React.useState<MaintenancePlanVersionSummaryJSON>(null);

  // update plan
  React.useEffect(() => {
    const selectedPlan = maintenancePlans.data?.items.find(
      (x) => x._id === maintenancePlanId
    );
    setSelectedMaintenancePlan(selectedPlan);
  }, [maintenancePlans.data?.items, maintenancePlanId]);

  // Functions
  const closeHandler = () => {
    props.onRequestClose();
  };

  const submitHandler = async () => {
    const url = history.location.pathname.split('/').slice(0, -2);
    url.push(selectedMaintenancePlan._id);
    if (selectedMaintenancePlan.state === 'editable') {
      url.push('kladde');
    } else {
      url.push('live');
    }
    const finalUrl = url.join('/');
    setSelectedMaintenancePlan(null);
    history.replace(finalUrl);
    props.onRequestClose();
  };

  // Items
  const items = maintenancePlans.data?.items.map((x, ind) => {
    // Variables
    let name = formatDate(new Date(x.publishedAt ?? x.createdAt), 'DD-MM-YYYY');
    let description = `Lavet af ${x.publisher?.name} ${x.publisher?.company ? `(${x.publisher?.company})` : ''
      }`;
    // Hvis det er en kladde
    if (x.state === 'editable') {
      name = 'Kladde';
      description = 'Ikke udgivet';
    }
    const isLive = x.state === 'live';

    // Return Item
    return (
      <LiveVersionModalItem
        key={`${ind}-live-version-modal-item`}
        isLive={isLive}
        checked={selectedMaintenancePlan?._id === x._id}
        onClick={() => setSelectedMaintenancePlan(x)}
        name={name}
        description={description}
        isLoaded={maintenancePlan.data?._id === x._id}
      />
    );
  });

  // Return
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader
        title="Vedligeholdelsesplan historik"
        onRequestClose={closeHandler}
      />
      <p className="mb-8">
        Her kan du se en liste over alle ejendommens vedligeholdelsesplaner.
        Vælg en version for at indlæse den.
      </p>
      {/* Items */}
      <div className="overflow-y-scroll max-h-96">{items}</div>
      {/* Buttons */}
      <ModalTwoButtons
        cancelBtnText="Annuller"
        onRequestClose={closeHandler}
        cancelColor="secondary"
        cancelTextColor="text-neutral-700 "
        btnText="Indlæs"
        disabled={!selectedMaintenancePlan}
        confirmHandler={() => submitHandler()}
      />
    </Modal>
  );
};

export default MaintenancePlanLiveVersionsModal;
