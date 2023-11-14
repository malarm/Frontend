// 3rd party libraries
import { isAxiosError } from 'axios'
import React from 'react'
import { useHistory } from 'react-router-dom'

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { usePathParamV2 } from '@project/ui'
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id'



export type IRedirectIfLockedRealEstateProps = {
  // 
}

/**
 * Should be rendered for ``/ejendomme/:id`` routes
 * 
 * Checks the ``useRealEstateById`` query for the current :id. If it throws a 403,
 * the user is redirected back to the ejendomme checklist
 */
export const RedirectIfLockedRealEstate: React.FC<IRedirectIfLockedRealEstateProps> = () => {

  const [realEstateId] = usePathParamV2('id')
  const history = useHistory()

  const query = useRealEstateById(realEstateId)

  const shouldRedirect = () => {
    if (!realEstateId) return false

    const error = query.error

    return isAxiosError(error) && error.response.status === 403
  }

  if (shouldRedirect()) {
    history.push(ThorPaths.EJENDOMME)
  }

  return null
}