// 3rd party libraries
import { useQueryClient, useMutation } from "@tanstack/react-query";

// Workspace libraries
import apiClient from "@thor-frontend/common/api-client";
import { useOrganization } from "@thor-frontend/features/organizations/queries/organization";



type IData = {
  organizationId: string;
  file: File;
};

export function updateOrganizationLogo(organizationId: string, file: File) {
  const formData = new FormData();

  formData.append('profilePicture', file);

  return apiClient.put(
    `/organizations/${organizationId}/logo`,
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
  );
}

/**
 * Mutation for updating organization logo. .
 *
 * @returns
 */
export const useUpdateOrganizationLogo = () => {
  const client = useQueryClient();
  return useMutation((data: IData) => updateOrganizationLogo(data.organizationId, data.file).then((x) => {
    client.invalidateQueries(useOrganization.key(data.organizationId));
    return x;
  }));
};