import { RealEstateExternalUserJSON } from '@project/shared/feature-real-estates/interfaces/real-estate-external-user.type'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@thor-frontend/common/api-client'


// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getRealEstateExternalUsers = (realEstateId: string) => apiClient.get<RealEstateExternalUserJSON[]>(
  `/real-estates/${realEstateId}/external-users`
)

// key
const key = (realEstateId: string) => [
  `real-estates`,
  realEstateId,
  'external-users'
]

// query
export const useRealEstateExternalUsers = (realEstateId: string) => {

  return useQuery(
    key(realEstateId),
    () => getRealEstateExternalUsers(realEstateId).then(response => response.data),
    {
      // options
      enabled: realEstateId != null, // prevent fetching when required param is missing
      placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useRealEstateExternalUsers.key = key
