import { CreateRealEstateExternalUserDTOJSON } from '@project/shared/feature-real-estates/interfaces/dtos/create-real-estate-external-user-dto.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@thor-frontend/common/api-client';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';


// add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  body: CreateRealEstateExternalUserDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const createRealEstateExternalUser = (data: IData) => apiClient.post(
  `/real-estates/${data.realEstateId}/external-users`,
  data.body
)


export const useCreateRealEstateExternalUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => createRealEstateExternalUser(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateById.key(data.realEstateId))

      return response.data
    })
  )
}