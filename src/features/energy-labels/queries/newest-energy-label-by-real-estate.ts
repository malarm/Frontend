// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { MEDocumentJSON } from '@project/shared/feature-me-document/interfaces/me-document.interface'
import apiClient from '@thor-frontend/common/api-client'



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getNewestEnergyLabelByRealEstate = (realEstateId: string) => apiClient.get<MEDocumentJSON>(
  `/real-estates/${realEstateId}/energy-label`
)

// key
const key = (realEstateId: string) => [
  `real-estates`,
  realEstateId,
  'energy-label'
]

/**
 * Get an energy label PDF reference for a real estate (will 404 if no PDF is present)
 * 
 * @param realEstateId 
 * @returns 
 */
export const useNewestEnergyLabelByRealEstate = (realEstateId: string) => {

  return useQuery(
    key(realEstateId),
    () => getNewestEnergyLabelByRealEstate(realEstateId).then(response => response.data),
    {
      // options
      enabled: realEstateId != null, // prevent fetching when required param is missing
      // placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useNewestEnergyLabelByRealEstate.key = key
