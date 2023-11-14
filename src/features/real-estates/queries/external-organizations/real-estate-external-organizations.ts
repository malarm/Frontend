// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { RealEstateExternalOrganizationJSON } from '@project/shared/feature-real-estates/interfaces/real-estate-external-organization.type'
import apiClient from '@thor-frontend/common/api-client'



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getRealEstateExternalOrganizations = (realEstateId: string) => apiClient.get<RealEstateExternalOrganizationJSON[]>(
  `/real-estates/${realEstateId}/external-organizations`
)

// key
const key = (realEstateId: string) => [
  `real-estates`,
  realEstateId,
  'external-organizations'
]

// query
export const useRealEstateExternalOrganizations = (realEstateId: string) => {

  return useQuery(
    key(realEstateId),
    () => getRealEstateExternalOrganizations(realEstateId).then(response => response.data),
    {
      // options
      enabled: realEstateId != null && realEstateId !== '', // prevent fetching when required param is missing
      placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useRealEstateExternalOrganizations.key = key
