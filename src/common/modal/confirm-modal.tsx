import React from 'react';
import ReactModal from 'react-modal';

// Modules
import classNames from 'classnames';

import ModalHeader from './modal-header';
import { Button, ButtonColor } from '@project/ui';
import ThorButton from '@thor-frontend/common/thor-button/thor-button';

export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: any;
  text: string;
  title: string;
  buttonText?: string;
  buttonTextClassName?: string;
  buttonColor?: ButtonColor;
  cancelText?: string;
  cancelTextClassName?: string;
  cancelHandler?: () => void;
  loading?: boolean;
  isDisabled?: boolean;
}

const ConfirmModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // Return
  return (
    <ReactModal
      isOpen={props.isOpen}
      closeTimeoutMS={350}
      contentLabel={props.title}
      className={classNames('', {
        open: props.isOpen,
      })}
      onAfterClose={() => {
        props?.onAfterClose?.();
      }}
      {...props}
    >
      <div className="flex flex-col p-8 rounded-xl bg-white w-[500px]">
        <ModalHeader
          title={props.title}
          onRequestClose={props.onRequestClose}
        />

        <p>{props.text}</p>

        <div className="mt-9 gap-3 flex justify-end">
          <ThorButton
            color="secondary"
            onClick={
              props.cancelHandler ? props.cancelHandler : props.onRequestClose
            }
            text={props.cancelText ?? 'Annuller'}
            textClassName={props.cancelTextClassName}
          />
          <ThorButton
            loading={props.loading}
            color={props.buttonColor ?? 'delete'}
            onClick={() => props.confirmHandler()}
            text={props.buttonText ? props.buttonText : 'Slet'}
            disabled={props.isDisabled}
            textClassName={props.buttonTextClassName}
          />
        </div>
      </div>
    </ReactModal>
  );
};

ConfirmModal.defaultProps = {
  cancelTextClassName: 'text-gray-800',
  buttonTextClassName: 'text-rose-500',
};

export default ConfirmModal;
