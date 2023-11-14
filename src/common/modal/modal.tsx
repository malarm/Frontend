// 3rd party libraries
import classNames from 'classnames';
import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import ReactModal, { Props as IReactModalProps } from 'react-modal';



export type IModalProps = {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  widthClassName?: string;
  colorClassName?: string;
  topClassName?: string;
} & IReactModalProps;

/**
 * Component description
 */
export const Modal: React.FC<PropsWithChildren<IModalProps>> = (props) => {
  const { children, ...reactModalProps } = props;

  // const
  return (
    <ReactModal
      {...reactModalProps}
      className={classNames(
        '',
        { open: props.isOpen },
        props.className.toString(),
        props.widthClassName,
        props.colorClassName,
        props.topClassName
      )}
      onRequestClose={() => props.setIsOpen?.(false)}
    >
      {children}
      {/* </div> */}
    </ReactModal>
  );
};

Modal.defaultProps = {
  closeTimeoutMS: 350,
  overlayClassName: '',
  className: 'rounded-xl shadow',
  widthClassName: 'w-[750px]',
  colorClassName: 'bg-white',
  topClassName: 'top-[80px]',
};
