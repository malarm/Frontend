// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection'
import apiClient from '@thor-frontend/common/api-client'



// fetcher
export const getInactiveCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => apiClient.get<RealEstateCardSummaryJSON[]>(
  `/real-estate-cards/by-maintenance-plan-version/${maintenancePlanVersionId}/inactive`
)

// key
const key = (maintenancePlanVersionId: string) => [
  'cards-by-maintenance-plan-version',
  maintenancePlanVersionId,
  'inactive'
]

// query
export const useInactiveCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => {

  return useQuery(
    key(maintenancePlanVersionId),
    () => getInactiveCardsByMaintenancePlanVersion(maintenancePlanVersionId).then(x => x.data),
    {
      // options
      enabled: maintenancePlanVersionId != null,
      placeholderData: [] // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useInactiveCardsByMaintenancePlanVersion.key = key