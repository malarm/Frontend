
import classNames from 'classnames'
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react'


export type IRadioProps = {
  checked: boolean
  onChange?: (checked: boolean) => void


  /**
   * Default is ``'w-6 h-6'``
   * 
   * Determines size of root (outer circle) component
   */
  sizeClassName?: string


  /**
   * Default is ``'w-2 h-2 bg-white'``
   * 
   * Determines size and color of the inner circle
   * 
   * A class like ``'hidden'`` can be passed to hide the inner circle
   */
  innerCircleClassName?: string

  /**
   * Default is ``'bg-black'``
   * 
   * Applied to the root (outer circle) when ``checked`` is ``true``
   */
  checkedClassName?: string

  /**
   * Default is ``'border-2 border-slate'``
   * 
   * Applied to the root (outer circle) when ``checked`` is ``false``
   */
  uncheckedClassName?: string
}

/**
 * Customizable radio component
 */
export const Radio: React.FC<IRadioProps> = (props) => {

  return <div className={classNames(
    'box-border rounded-full grid place-content-center',
    props.sizeClassName,

    // checked style
    { [props.checkedClassName]: props.checked },

    // unchecked style
    { [props.uncheckedClassName]: !props.checked },

  )} onClick={() => props.onChange?.(!props.checked)}>
    <div className={`rounded-full ${props.innerCircleClassName}`} />
  </div>
}


Radio.defaultProps = {
  sizeClassName: 'w-6 h-6',
  innerCircleClassName: 'w-2 h-2 bg-white',
  checkedClassName: 'bg-black',
  uncheckedClassName: 'bg-white border-2 border-slate'
}