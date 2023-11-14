// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { OrganizationJson } from '@project/shared/feature-organizations/types/organization.type'
import { UpdateOrganizationJSON } from '@project/shared/feature-organizations/types/dtos/update-organization-dto.type';
import apiClient from '@thor-frontend/common/api-client';



type IUpdateOrg = {
  organizationId: string;
  dto: UpdateOrganizationJSON;
};

export const updateOrganizationKey = (organizationId: string) => ['organizations', organizationId]

const UpdateOrganization = (organizationId: string, dto: UpdateOrganizationJSON) => apiClient.patch<OrganizationJson>(`/organizations/${organizationId}`, dto);

/**
 * Mutation for updating organization. Invalidates the "useOrganizations" query.
 *
 * @returns
 */
export const useUpdateOrganization = () => {
  const client = useQueryClient();
  return useMutation((data: IUpdateOrg) => UpdateOrganization(data.organizationId, data.dto).then((x) => {
    client.invalidateQueries(updateOrganizationKey(data.organizationId));
    return x;
  }));
};
