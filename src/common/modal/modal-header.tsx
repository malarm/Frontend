// 3rd party libraries
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';



export interface Props {
  onRequestClose: () => void;
  title: string | ReactNode;
}

const ModalHeader: React.FC<Props> = (props) => {
  const [hoverCloseIcon, setHoverCcloseIcon] = React.useState<boolean>(false);
  // Return
  return (
    <div className="flex w-full justify-between mb-5">
      <h2 className="font-medium text-xl text-gray-800 mt-0.5">
        {props.title}
      </h2>

      <i
        className="ri-close-line text-2xl text-black opacity-50 hover:opacity-100 cursor-pointer"
        onClick={() => props.onRequestClose()}
      />
    </div>
  );
};

export default ModalHeader;
