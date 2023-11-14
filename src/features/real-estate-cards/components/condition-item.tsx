// 3rd party libraries
import classNames from 'classnames'
import React from 'react'

// Workspace libraries
import { BigRadio } from '@project/ui/radio/big-radio'



export type IConditionItemProps = {
  onClick: () => void
  checked: boolean
  conditionName: string
  icon?: string;
  svgIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  colorClassName?: string;
  className?: string
}

/**
 * Render a condition text  (used in the "details section -> condition")
 */
export const CondititonItem: React.FC<IConditionItemProps> = (props) => {

  const {
    conditionName,
    icon,
    ...bigRadioProps
  } = props

  return <BigRadio
    {...bigRadioProps}
  >
    <div className="flex flex-row">
      <p className='pr-4'>{props.svgIcon && <props.svgIcon />}</p>
      <p className="text-black font-medium">{conditionName}</p>
    </div>
  </BigRadio>
}
