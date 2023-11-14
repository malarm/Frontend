import { UpdateRealEstateExternalUserDTOJSON } from '@project/shared/feature-real-estates/interfaces/dtos/update-real-estate-external-user-dto.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@thor-frontend/common/api-client';


// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  externalUserId: string
  dto: UpdateRealEstateExternalUserDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateRealEstateExternalUser = (data: IData) => apiClient.patch(
  `/real-estates/${data.realEstateId}/external-users/${data.externalUserId}`,
  data.dto
)


export const useUpdateRealEstateExternalUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateRealEstateExternalUser(data).then(response => {

      // todo invalidate affected queries
      // client.invalidateQueries('some-key')

      return response.data
    })
  )
}