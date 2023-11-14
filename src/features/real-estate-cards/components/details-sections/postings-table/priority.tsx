// 3rd party libraries
import React from 'react'

// Workspace libraries
import { PriorityLevel } from '@project/shared/feature-work-tasks/enums/priority-level.enum'



export type IPriorityProps = {
  level: PriorityLevel,
  onClick?: () => void
}

/**
 * WOrk tasks priority level display / selector (clickable)
 */
export const Priority: React.FC<IPriorityProps> = (props) => {

  const bgClass = () => {
    if (props.level === 0) {
      return 'bg-rose-500'
    }
    if (props.level === 1) {
      return 'bg-amber-500'
    }
    return 'bg-green'
  }

  return <div
    className={`w-6 h-6 grid place-content-center text-white rounded-lg font-medium ${bgClass()} ${props.onClick ? 'cursor-pointer' : ''}`}
  >{props.level + 1}</div>
}