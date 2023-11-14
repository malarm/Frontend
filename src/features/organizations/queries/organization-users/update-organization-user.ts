// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { UpdateOrganizationUserDTOJSON } from '@project/shared/feature-organizations/types/dtos/update-organizaton-user-dto.type';
import apiClient from '@thor-frontend/common/api-client';
import { useOrganization } from '@thor-frontend/features/organizations/queries';



// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  organizationId: string
  organizationUserId: string
  dto: UpdateOrganizationUserDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateOrganizationUser = (data: IData) => apiClient.patch(
  `/organizations/${data.organizationId}/users/${data.organizationUserId}`,
  data.dto
)


export const useUpdateOrganizationUser = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateOrganizationUser(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useOrganization.key(data.organizationId))

      return response.data
    })
  )
}