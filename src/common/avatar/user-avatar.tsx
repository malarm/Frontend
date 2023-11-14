// 3rd party libraries
import React from 'react'

// Workspace libraries
import { UserAvatar as SharedUserAvatar, UserAvatarProps as SharedUserAvatarProps } from '@project/ui/user-avatar'



export type IUserAvatarProps = SharedUserAvatarProps & {

  /**
 * Default is ``'bg-mortar'``
 */
  bgClassName?: string
}


const Defaults = {
  bgClassName: 'bg-mortar'
} satisfies Partial<IUserAvatarProps>


export const UserAvatar: React.FC<IUserAvatarProps> = (props) => {

  const merged = Object.assign({}, Defaults, props)

  return <SharedUserAvatar {...merged} />
}

