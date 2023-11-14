// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type'
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection'
import apiClient from '@thor-frontend/common/api-client'



// fetcher
export const getCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => apiClient.get<RealEstateCardSummaryJSON[]>(
  `/real-estate-cards/by-maintenance-plan-version/${maintenancePlanVersionId}`
)

// key
const key = (maintenancePlanVersionId: string) => [
  'cards-by-maintenance-plan-version',
  maintenancePlanVersionId
]

// query
export const useCardsByMaintenancePlanVersion = (maintenancePlanVersionId: string) => {

  return useQuery(
    key(maintenancePlanVersionId),
    () => getCardsByMaintenancePlanVersion(maintenancePlanVersionId).then(x => x.data),
    {
      // options
      enabled: maintenancePlanVersionId != null,
      placeholderData: [] // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useCardsByMaintenancePlanVersion.key = key