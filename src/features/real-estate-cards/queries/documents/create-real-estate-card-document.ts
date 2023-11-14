// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string,
  documentFiles: File[]
} // add body type here, eg 'CreateUserDTO' or { userId: string }

// post/patch/delete request (replace 'create' appropriately if needed)
const createRealEstateCardDocuments = (dto: IData) => {

  const form = new FormData()

  dto.documentFiles.forEach((file, index) => {
    form.append(`document-${index}`, file)
  })

  return apiClient.post(
    `/real-estate-cards/${dto.realEstateCardId}/documents`,
    form
  )
}


export const useCreateRealEstateCardDocuments = () => {

  const client = useQueryClient()

  return useMutation(
    (dto: IData) => createRealEstateCardDocuments(dto).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateCardById.key(dto.realEstateCardId))

      return x.data
    })
  )
}