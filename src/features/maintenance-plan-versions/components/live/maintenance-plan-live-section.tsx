// 3rd party libraries
import React, { ReactNode } from 'react'



export type IMaintenancPlanLiveSectionProps = {
  children: ReactNode
}

/**
 * Component description
 */
export const MaintenancPlanLiveSection: React.FC<IMaintenancPlanLiveSectionProps> = (props) => {

  return <div className="pb-8 border-b border-neutral-200">
    {props.children}
  </div>
}