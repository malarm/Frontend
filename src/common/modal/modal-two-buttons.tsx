// 3rd party libraries
import React from 'react';
import ReactModal from 'react-modal';

// Workspace libraries
import { Button } from '@project/ui';
import { UpsiteButton } from '@project/ui/button/upsite-button'



export interface Props {
  onRequestClose: () => void;
  confirmHandler: () => void;
  cancelBtnText?: string;
  btnText: string;
  disabled?: boolean;
  disabledCancel?: boolean;
  loading?: boolean;
  isActive?: boolean;
  toolTipText?: string;
  disabledText?: string;
  justify?: string;
  cancelColor?: any;
  btnColor?: any;
  cancelTextColor?: string;
}

const ModalTwoButtons: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // Return
  return (
    <div
      className={`mt-9 flex justify-${props.justify ? props.justify : 'end'}`}
    >
      <UpsiteButton
        isDisabled={props.disabledCancel}
        type="secondary"
        onClick={props.onRequestClose}>{props.cancelBtnText ?? 'Annuller'}</UpsiteButton>
      <UpsiteButton
        isDisabled={props.disabled}
        onClick={props.confirmHandler}
        isLoading={props.loading}
        disabledText={props.disabledText}
        className="ml-3 transition"
      >{props.btnText ?? 'Bekræft'}</UpsiteButton>
    </div>
  );
};

export default ModalTwoButtons;
