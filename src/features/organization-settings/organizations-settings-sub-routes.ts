// 3rd party libraries
import { FC } from "react"

// Application
import OrganizationDetails from "./sub-pages/organization-details"
import UsersList from "./sub-pages/users-list"



export type ISettingsSubRoute = {
  path: string,
  header: string,
  component: FC,
  icon: string
}

export const OrganizationSettingsSubRoutes: ISettingsSubRoute[] = [
  {
    path: '/organisation',
    header: 'Organisation',
    component: OrganizationDetails,
    icon: 'ri-profile-line'
  },
  {
    path: '/brugere',
    header: 'Brugere',
    component: UsersList,
    icon: 'ri-user-smile-line'
  },
]