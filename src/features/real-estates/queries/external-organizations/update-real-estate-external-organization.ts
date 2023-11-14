// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { UpdateRealEstateExternalOrganizationDTOJSON } from '@project/shared/feature-real-estates/interfaces/dtos/update-real-estate-external-organization-dto.type'
import { useRealEstateExternalOrganizations } from '@thor-frontend/features/real-estates/queries/external-organizations/real-estate-external-organizations';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';



// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  externalOrganizationId: string
  dto: UpdateRealEstateExternalOrganizationDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateRealEstateExternalOrganization = (data: IData) => apiClient.patch(
  `/real-estates/${data.realEstateId}/external-organizations/${data.externalOrganizationId}`,
  data.dto
)

/**
 * Accessible for users, that have an 'admin' relation, to the organization
 * that owns the specified real estate
 */
export const useUpdateRealEstateExternalOrganization = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateRealEstateExternalOrganization(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateExternalOrganizations.key(data.realEstateId))
      client.invalidateQueries(useRealEstateById.key(data.realEstateId))

      return response.data
    })
  )
}