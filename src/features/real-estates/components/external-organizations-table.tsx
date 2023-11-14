// 3rd party libraries
import React, { useState } from 'react'

// Workspace libraries
import { capitalize } from '@project/shared/common/utils/capitalize.util'
import { humanOrganizationRole } from '@project/shared/feature-organizations/enums/organization-role.enum'
import { RealEstateExternalOrganizationJSON } from '@project/shared/feature-real-estates/interfaces/real-estate-external-organization.type'
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table'
import { OrganizationAvatar } from '@thor-frontend/features/organizations/components/organization-avatar'
import { DropdownMenuV2 } from '@project/ui'
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { ShareWithOrganizationModal } from '@thor-frontend/features/real-estates/modals/share-with-organization'
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id'
import { useOrganization } from '@thor-frontend/features/organizations/queries'



export type IExternalOrganizationsTableProps = {
  organizations: RealEstateExternalOrganizationJSON[]
  realEstateId: string
}

/**
 * Component description
 */
export const ExternalOrganizationsTable: React.FC<IExternalOrganizationsTableProps> = (props) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const organizationId = useOrganizationId();
  const organizationsQuery = useOrganization(organizationId);
  const organization = organizationsQuery.data;

  return <>
    <ThorTable
      tbody={{
        className: 'divide-y divide-slate text-neutral-500 text-sm',
        td: {
          className: 'py-3 px-2'
        }
      }}
      columns={[

        // logo
        {
          header: '',
          cell: x => <OrganizationAvatar />,
          colProps: {
            className: 'w-0'
          }
        },

        // name
        {
          header: 'Navn',
          cell: x => (
            <>
              <p className='text-black font-medium text-base'>{x.name}</p>
              <p>{x.email}</p>
            </>
          ),
          tdClassName: (item, defaultClassName) => defaultClassName + ' text-black font-medium text-base'
        },

        // Rettighed
        {
          header: 'Rettighed',
          cell: x => capitalize(humanOrganizationRole(x.role)),
        },

        {
          header: "",
          cell: x => (
            <DropdownMenuV2
              className="block !h-full !w-full text-right"
              showRemixIcon
              align="right"
              items={[
              ]}
            />
          ),
        }
      ]}
      data={props.organizations}

    />
    {/*  <UpsiteButton
    onClick={() => setModalIsOpen(true)}
    type="secondary"
    className="mt-8"
  ><i className="text-xl ri-share-line text-black"/> Del ejendom</UpsiteButton> */}
    {/*   {
      modalIsOpen &&
      <ShareWithOrganizationModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        organizationName={organization?.name}
        realEstateId={props.realEstateId}
      />
    } */}
  </>
}