// 3rd party libraries
import React from 'react';
import { FC } from 'react';

// Workspace libraries
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { useConfirmStore } from '@project/ui/confirm';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';



/**
 * Add to App element to enable usage
 * of ``useConfirm``
 */

export const ConfirmProvider: FC = () => {
  const {
    body,
    isOpen,
    title,
    onSubmit,
    close,
    leftButtonText,
    rightButtonText,
    rightButtonColor,
    leftButtonColor,
  } = useConfirmStore();

  return (
    <Modal
      widthClassName="w-[600px]"
      topClassName="top-[145px]"
      portalClassName="relative z-[9999]"
      isOpen={isOpen}
      contentLabel={typeof title === 'string' ? title : ''}
      onAfterClose={() => close()}
    >
      <ModalHeader title={title} onRequestClose={() => close()} />

      <p>{body}</p>
      <div className="flex flex-row gap-3 justify-end mt-4">
        <ModalTwoButtons
          cancelBtnText={leftButtonText}
          cancelColor={leftButtonColor}
          btnText={rightButtonText}
          btnColor={rightButtonColor}
          onRequestClose={() => onSubmit(false)}
          confirmHandler={() => onSubmit(true)}
        />
      </div>
    </Modal>
  );
};
