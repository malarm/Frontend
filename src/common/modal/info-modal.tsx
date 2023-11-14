// 3rd party libraries
import React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';

// Workspace libraries
import { Button } from '@project/ui';
import { UpsiteButton } from '@project/ui/button/upsite-button'



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  text: string;
  title: string;
}

const InfoModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // Return
  return (
    <ReactModal
      isOpen={props.isOpen}
      closeTimeoutMS={350}
      contentLabel={props.text}
      className={classNames('', {
        open: props.isOpen,
      })}
      onAfterClose={() => {
        props?.onAfterClose?.();
      }}
      {...props}
    >
      <div className="flex flex-col bg-white p-8 rounded-xl w-[768px]">
        <div className="flex justify-between mb-6">
          <h3 className="font-medium text-black">{props.title}</h3>
          <div className="cursor-pointer" onClick={props.onRequestClose}>
            X
          </div>
        </div>

        <p>{props.text}</p>

        <div className="mt-9 flex justify-end">
          <UpsiteButton
            onClick={props.onRequestClose}
            type="secondary"
            className="ml-3"
          >
            <p className="text-black">Ok</p>
          </UpsiteButton>
        </div>
      </div>
    </ReactModal>
  );
};

export default InfoModal;
