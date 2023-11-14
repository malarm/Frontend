// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { OrganizationInvitationJSON } from '@project/shared/feature-organization-invitations/types/organization-invitation.type'
import apiClient from '@thor-frontend/common/api-client'



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getOrganizationInvitations = (organizationId: string) => apiClient.get<OrganizationInvitationJSON[]>(
  `/organization-invitations/by-organization/${organizationId}/pending`
)

// key
const key = (organizationId: string) => [
  `organization-invitations`,
  organizationId
]

// query
export const useOrganizationInvitations = (organizationId: string) => {

  return useQuery(
    key(organizationId),
    () => getOrganizationInvitations(organizationId).then(response => response.data),
    {
      // options
      enabled: organizationId != null, // prevent fetching when required param is missing
      placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useOrganizationInvitations.key = key
