// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type'
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection'
import apiClient from '@thor-frontend/common/api-client'



// fetcher
export const getFullCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => apiClient.get<RealEstateCardJSON[]>(
  `/real-estate-cards/by-maintenance-plan-version/${maintenancePlanVersionId}/full`
)

// key
const key = (maintenancePlanVersionId: string) => [
  'cards-by-maintenance-plan-version',
  maintenancePlanVersionId,
  'full'
]

// query
export const useFullCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => {

  return useQuery(
    key(maintenancePlanVersionId),
    () => getFullCardsByMaintenancePlanVersion(maintenancePlanVersionId).then(x => x.data),
    {
      // options
      enabled: maintenancePlanVersionId != null,
      placeholderData: [] // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useFullCardsByMaintenancePlanVersion.key = key