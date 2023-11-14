// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { CreateOrganizationInvitationDTOJSON } from '@project/shared/feature-organization-invitations/types/dtos/create-organization-invitation.type';
import apiClient from '@thor-frontend/common/api-client';
import { useOrganizationInvitations } from '@thor-frontend/features/organization-settings/queries/organization-invitations';



type IData = CreateOrganizationInvitationDTOJSON; // add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const createOrganizationInvitation = (data: IData) =>
  apiClient.post(`/organization-invitations`, data);

export const useCreateOrganizationInvitation = () => {
  const client = useQueryClient();

  return useMutation((data: IData) =>
    createOrganizationInvitation(data).then((response) => {
      // invalidate affected queries
      client.invalidateQueries(
        useOrganizationInvitations.key(data.organizationId)
      );

      return response.data;
    })
  );
};
