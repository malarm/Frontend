// 3rd party libraries
import React from 'react'

// Workspace libraries
import { BigRadio } from '@project/ui/radio/big-radio'



export type IRoleItemProps = {
  onClick: () => void
  checked: boolean
  roleName: string
  roleDescription: string
}

/**
 * Render a selectable role (used in the "Invite user to organization" modal)
 */
export const RoleItem: React.FC<IRoleItemProps> = (props) => {

  const {
    roleName,
    roleDescription,
    ...bigRadioProps
  } = props

  return <BigRadio
    {...bigRadioProps}
  >
    <div className="flex flex-col">
      <p className="text-black">{roleName}</p>
      <p className="text-neutral-500 text-sm">{roleDescription}</p>
    </div>
  </BigRadio>
}