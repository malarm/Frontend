// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { CreateRealEstateExternalOrganizationDTOJSON } from '@project/shared/feature-real-estates/interfaces/dtos/create-real-estate-external-organization-dto.type'
import { useRealEstateExternalOrganizations } from '@thor-frontend/features/real-estates/queries/external-organizations/real-estate-external-organizations';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';



// add data type here, eg 'CreateUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  dto: CreateRealEstateExternalOrganizationDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const createRealEstateExternalOrganization = (data: IData) => apiClient.post(
  `/real-estates/${data.realEstateId}/external-organizations`,
  data.dto
)

/**
 * Accessible for users, that have an 'admin' relation, to the organization
 * that owns the specified real estate
 */
export const useCreateRealEstateExternalOrganization = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => createRealEstateExternalOrganization(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateExternalOrganizations.key(data.realEstateId))
      client.invalidateQueries(useRealEstateById.key(data.realEstateId))
      client.invalidateQueries(useRealEstates.key())

      return response.data
    })
  )
}