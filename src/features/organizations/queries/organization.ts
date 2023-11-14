// 3rd party libraries
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { OrganizationJson } from '@project/shared/feature-organizations/types/organization.type';
import apiClient from '@thor-frontend/common/api-client';



export const organizationKey = (organizationId: string) => [
  'organizations',
  organizationId,
];

const getOrganization = (organizationId: string) =>
  apiClient<OrganizationJson>(`/organizations/${organizationId}`);

/**
 * Query for a single organization by id. The organization fetched has more properties
 * than those in the organization list queries.
 *
 * @param organizationId
 * @returns
 */
export const useOrganization = (organizationId: string) => {
  return useQuery(
    organizationKey(organizationId),
    () =>
      getOrganization(organizationId).then((x) => {
        return x.data;
      }),
    {
      enabled: !!organizationId,
    }
  );
};

useOrganization.key = organizationKey;
