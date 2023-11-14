// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string,
  pictureId: string
} // add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const disableRealEstateCardPicture = (data: IData) => apiClient.patch(
  `/real-estate-cards/${data.realEstateCardId}/pictures/${data.pictureId}/disable`,
  data
)


export const useDisableRealEstateCardPicture = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => disableRealEstateCardPicture(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateCardById.key(data.realEstateCardId))

      return response.data
    })
  )
}