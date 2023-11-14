import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@thor-frontend/common/api-client';


// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  externalUserId: string
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const deleteRealEstateExternalUser = (data: IData) => apiClient.delete(
  `/real-estates/${data.realEstateId}/external-users/${data.externalUserId}`
)


export const useDeleteRealEstateExternalUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteRealEstateExternalUser(data).then(response => {

      // todo invalidate affected queries
      // client.invalidateQueries('some-key')

      return response.data
    })
  )
}