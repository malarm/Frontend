// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string,
  pictureId: string
} // add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'

// post/patch/delete request (replace 'delete' appropriately if needed)
const deleteRealEstateCardPicture = (data: IData) => apiClient.delete(
  `/real-estate-cards/${data.realEstateCardId}/pictures/${data.pictureId}`
)


export const useDeleteRealEstateCardPicture = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteRealEstateCardPicture(data).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateCardById.key(data.realEstateCardId))
      client.invalidateQueries(useCardsByMaintenancePlanVersion.key('').slice(0, 1))

      return x.data
    })
  )
}