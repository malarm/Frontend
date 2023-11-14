// 3rd party libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Workspace libraries
import apiClient from "@thor-frontend/common/api-client";
import { useOrganization } from "@thor-frontend/features/organizations/queries/organization";



const deleteOrganizationLogo = (organizationId: string) => apiClient.delete(`/organizations/${organizationId}/logo`);

/**
 * Mutation for delete organization logo .
 *
 * @returns
 */
export const useDeleteOrganizationLogo = () => {
  const client = useQueryClient();
  return useMutation((organizationId: string) => deleteOrganizationLogo(organizationId).then((x) => {
    client.invalidateQueries(useOrganization.key(organizationId));
    return x;
  }));
};

