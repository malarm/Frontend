// 3rd party libraries
import classNames from 'classnames';
import React from 'react';



export type ICheckboxProps = {
  isChecked: boolean;

  /**
   * Invoked when the checkbox is clicked
   *
   * @param value
   * @returns
   */
  onChange?: (value: boolean) => void;

  /**
   * Default is ``ri-check-line``
   *
   * Remix icon class
   */
  icon?: string;

  /**
   * Adjust styling/classes
   */
  styling?: {
    /**
     * Defaults to ``w-6 h-6``
     */
    sizeClassName?: string;

    /**
     * Defaults to ``border-1 rounded-md``
     */
    borderClassName?: string;

    /**
     * Applied to the root element when ``isChecked`` is true
     */
    checkedClassName?: string;

    /**
     * Applied to the root element when ``isChecked`` is false
     */
    uncheckedClassName?: string;

    /**
     * Defaults to ``text-white``
     */
    iconClassName?: string;
  };

  isDisabled?: boolean
};

/**
 * Overrideable default styling
 */
const DefaultStyling = {
  borderClassName: 'border-1 rounded-md',
  checkedClassName: 'bg-black border-2 border-neutral-200',
  sizeClassName: 'w-6 h-6',
  uncheckedClassName: 'bg-white border-slate',
  iconClassName: 'text-white',
} satisfies Partial<ICheckboxProps['styling']>;

/**
 * A simple checkbox component with customizable styling
 */
export const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const {
    borderClassName,
    checkedClassName,
    uncheckedClassName,
    sizeClassName,
    iconClassName,
  } = {
    ...DefaultStyling,
    ...(props.styling ?? {}),
  };

  return (
    <div
      onClick={() => props.isDisabled !== true && props.onChange && props.onChange(!props.isChecked)}
      className={classNames(
        'cursor-pointer box-border grid place-content-center',
        borderClassName,
        sizeClassName,
        { [uncheckedClassName]: !props.isChecked },
        { [checkedClassName]: props.isChecked }
      )}
    >
      {props.isChecked ? (
        <i className={`${props.icon} ${iconClassName}`}></i>
      ) : (
        ''
      )}
    </div>
  );
};

Checkbox.defaultProps = {
  icon: 'ri-check-line',
};
