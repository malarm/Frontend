// 3rd party libraries
import React, { ReactNode } from 'react';



export type IInfoboxProps = {
  /**
   * Added to the container element
   */
  className?: string;

  children: ReactNode;
};

/**
 * Renders a colored box with a warning icon
 */
export const Infobox: React.FC<IInfoboxProps> = (props) => {
  return (
    <div
      className={`flex flex-row rounded-xl bg-mortar p-4 ${props.className}`}
    >
      <i className="ri-error-warning-line text-2xl mr-2 leading-6" />

      <div>{props.children}</div>
    </div>
  );
};

Infobox.defaultProps = {
  className: '',
};
