// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string
}

// post/patch/delete request (replace 'delete' appropriately if needed)
const deleteRealEstateCard = (data: IData) => apiClient.delete(
  `/real-estate-cards/${data.realEstateCardId}`
)


export const useDeleteRealEstateCard = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteRealEstateCard(data).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useCardsByMaintenancePlanVersion.key('').slice(0, 1))
      client.removeQueries(useRealEstateCardById.key(data.realEstateCardId))

      return x.data
    })
  )
}