// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string,
  documentId: string
} // add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'

// post/patch/delete request (replace 'delete' appropriately if needed)
const deleteRealEstateCardDocument = (data: IData) => apiClient.delete(
  `/real-estate-cards/${data.realEstateCardId}/documents/${data.documentId}`
)


export const useDeleteRealEstateCardDocument = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteRealEstateCardDocument(data).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateCardById.key(data.realEstateCardId))

      return x.data
    })
  )
}