import React, { useEffect, useMemo, useState } from 'react';

// Modules
import classNames from 'classnames';
import ReactModal from 'react-modal';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import toast from '@thor-frontend/common/utils/toast';
import PublishMaintenancePlanLoadingText from '@thor-frontend/features/real-estates/modals/publish-maintenance-plan-loading-text';
import { Modal } from '@thor-frontend/common/modal/modal';

export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

const PublishMaintenancePlanLoadingModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // Function

  // Return
  return (
    <Modal
      isOpen={props.isOpen}
      {...props}
      colorClassName="bg-purple"
      widthClassName="w-[600px] h-[377px]"
    >
      <div className="flex justify-center mb-6">
        <UpsiteLogoLoader heightPx={65} widthPx={65} />
      </div>

      <PublishMaintenancePlanLoadingText />

      <div className="flex justify-center">
        <p
          onClick={() => {
            toast.info('Vi er der lige om lidt ...');
          }}
          className="text-center text-base font-normal underline cursor-pointer"
        >
          Afbryd
        </p>
      </div>
    </Modal>
  );
};

export default PublishMaintenancePlanLoadingModal;
