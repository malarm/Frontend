// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useOrganization } from '@thor-frontend/features/organizations/queries';



// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  organizationId: string
  organizationUserId: string
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const deleteOrganizationUser = (data: IData) => apiClient.delete(
  `/organizations/${data.organizationId}/users/${data.organizationUserId}`
)


export const useDeleteOrganizationUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteOrganizationUser(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useOrganization.key(data.organizationId))

      return response.data
    })
  )
}