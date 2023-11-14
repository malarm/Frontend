// Workspace libraries
import { OrganizationType } from "@project/shared/feature-organizations/enums/organization-type.enum"
import { useOrganizationId } from "@thor-frontend/common/hooks/use-organization-id"
import { useOrganization } from "@thor-frontend/features/organizations/queries"



type IOptions = {
  /**
   * Defaults to ``[2]`` (partner type)
   */
  organizationTypes?: OrganizationType[]
}

const DefaultOptions: Required<IOptions> = {
  organizationTypes: [2]
}


/**
 * Returns true if the current organization has any of the types, specified
 * in ``options`` (default is to check whether the type is partner)
 */
export const useOrganizationHasType = (options?: IOptions) => {

  const organizationId = useOrganizationId()

  const merged = Object.assign({}, DefaultOptions, options ?? {})

  const organizationQuery = useOrganization(organizationId)

  return {
    result: merged.organizationTypes.includes(organizationQuery.data?.organizationType),
    isLoading: organizationQuery.status === 'loading'
  }
}