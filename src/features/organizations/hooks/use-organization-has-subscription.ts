// Workspace libraries
import { OrganizationSubscription } from "@project/shared/feature-organizations/enums/organization-subscription.enum"
import { useOrganizationId } from "@thor-frontend/common/hooks/use-organization-id"
import { useOrganization } from "@thor-frontend/features/organizations/queries"



type IOptions = {
  /**
   * Defaults to 
   */
  subscription?: OrganizationSubscription[]
}

const DefaultOptions: Required<IOptions> = {
  subscription: ['essential', 'advanced']
}


/**
 * Returns true if the current organization has any of the types, specified
 * in ``options`` (default is to check whether the type is partner)
 */
export const useOrganizationHasSubscription = (options?: IOptions) => {

  const organizationId = useOrganizationId()

  const merged = Object.assign({}, DefaultOptions, options ?? {})

  const organizationQuery = useOrganization(organizationId)

  return {
    result: merged.subscription.includes(organizationQuery.data?.subscription),
    isLoading: organizationQuery.status === 'loading'
  }
}