// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { CreateOrganizationUserDTOJSON } from '@project/shared/feature-organizations/types/dtos/create-organization-user-dto.type';
import apiClient from '@thor-frontend/common/api-client';
import { useOrganization } from '@thor-frontend/features/organizations/queries';



// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  organizationId: string
  dto: CreateOrganizationUserDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const createOrganizationUser = (data: IData) => apiClient.post(
  `/organizations/${data.organizationId}/users`,
  data.dto
)


export const useCreateOrganizationUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => createOrganizationUser(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useOrganization.key(data.organizationId))

      return response.data
    })
  )
}