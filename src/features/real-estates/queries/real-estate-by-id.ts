// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { SparseRealEstateJSON } from '@project/shared/feature-real-estates/projections/sparse-real-estate.projection'
import apiClient from '@thor-frontend/common/api-client'



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getRealEstateById = (realEstateId: string) => apiClient.get<SparseRealEstateJSON>(
  `/real-estates/${realEstateId}`
)

// key
const key = (realEstateId: string) => [
  `real-estates`,
  realEstateId
]

// query
export const useRealEstateById = (realEstateId: string) => {

  return useQuery(
    key(realEstateId),
    () => getRealEstateById(realEstateId).then(response => response.data),
    {
      // options
      enabled: realEstateId != null, // prevent fetching when required param is missing
      // placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useRealEstateById.key = key
