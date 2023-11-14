// 3rd Party Libraries
import { useQuery } from '@tanstack/react-query'
import { isEmail } from 'class-validator'

// Workspace Library
import { MinimalOrganizationJSON } from '@project/shared/feature-organizations/projections/organization-summary.projection'

// Local
import apiClient from '@thor-frontend/common/api-client'



export const getOrganizationByEmail = (email: string) => apiClient.get<MinimalOrganizationJSON>(
  `/organizations/by-email/${email}`
)


const key = (email: string) => [
  `organizations`,
  'by-email',
  email
]

// query
export const useOrganizationByEmail = (email: string) => {

  return useQuery(
    key(email),
    () => getOrganizationByEmail(email).then(response => response.data),
    {
      enabled: email && isEmail(email),
    }
  )
}

// make query key accessible
useOrganizationByEmail.key = key
