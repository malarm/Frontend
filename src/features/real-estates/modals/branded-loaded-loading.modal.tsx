// 3rd party libraries
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';

// Workspace libraries
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import toast from '@thor-frontend/common/utils/toast';
import { Modal } from '@thor-frontend/common/modal/modal';
import BrandedUpsiteLoadingText from '@thor-frontend/features/real-estates/modals/branded-modal-loading-text';



export interface Props extends ReactModal.Props {

  isOpen: boolean;

  onRequestClose: () => void;

  text: string;

  /**
   * Defaults to ```1000```
   */
  intervalMiliSeconds?: number;

  /**
   * Defaults to ```11```
   */
  publishProgressAddBy?: number;

  /**
   * Default is false
   * 
   * If true, progress will not go over 99%
   */
  stall?: boolean
}

const BrandedUpsiteLoadingModal: React.FC<Props> = (props) => {
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

      <BrandedUpsiteLoadingText
        intervalMiliSeconds={props.intervalMiliSeconds}
        publishProgressAddBy={props.publishProgressAddBy}
        text={props.text}
        stall={props.stall}
      />

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

BrandedUpsiteLoadingModal.defaultProps = {
  intervalMiliSeconds: 1000,
  publishProgressAddBy: 11,
  stall: false
};

export default BrandedUpsiteLoadingModal;
