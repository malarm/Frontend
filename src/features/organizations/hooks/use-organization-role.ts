import { OrganizationRole } from "@project/shared/feature-organizations/enums/organization-role.enum"
import { useOrganizationId } from "@thor-frontend/common/hooks/use-organization-id"
import { useCurrentUser } from "@thor-frontend/features/users/queries/current-user"

/**
 * Returns the current users organization role.
 * 
 * Returns an empty string 
 */
export const useOrganizationRole = (): OrganizationRole | undefined => {

  const organizationId = useOrganizationId()
  const userQuery = useCurrentUser()

  if (!userQuery.data || !organizationId) return undefined

  return (userQuery.data.organizations ?? []).find(x => x.organizationId === organizationId)?.role
}