// 3rd party libraries
import classNames from 'classnames'
import React from 'react'

// Workspace libraries
import { MEDocumentJSON } from '@project/shared/feature-me-document/interfaces/me-document.interface'



export type IOrganizationAvatarProps = {

  /**
   * Organization logo
   */
  logo?: MEDocumentJSON


  sizeClassName?: string
}



/**
 * Component description
 */
export const OrganizationAvatar: React.FC<IOrganizationAvatarProps> = (props) => {

  if (!props.logo) {
    return <div className={classNames(
      props.sizeClassName,
      'rounded-xl bg-mortar grid place-content-center'
    )}>
      <i className="ri-star-line text-xl"></i>
    </div>
  }

  return <div className="rounded-xl">

  </div>
}

OrganizationAvatar.defaultProps = {
  sizeClassName: 'h-8 w-8'
}