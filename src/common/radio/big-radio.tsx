import { Radio } from '@thor-frontend/common/radio/radio';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

export type IBigRadioProps = {
  onClick: () => void;
  checked: boolean;
  children: ReactNode;
  colorClassName?: string;
  className?: string;
};

/**
 * Render a box with a radio and a label
 */
export const BigRadio: React.FC<IBigRadioProps> = (props) => {
  const colorClass = props.checked
    ? props.colorClassName ?? 'bg-black bg-opacity-5'
    : '';

  return (
    <div
      onClick={props.onClick}
      className={classNames(
        'py-4 px-6 grid grid-flow-col gap-4 items-center rounded-xl cursor-pointer group',
        colorClass,
        props.className,
        { 'hover:bg-black hover:bg-opacity-5': !props.checked }
      )}
      style={{ gridTemplateColumns: 'max-content 1fr' }}
    >
      <Radio checked={props.checked} />
      {props.children}
    </div>
  );
};
