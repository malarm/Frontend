// 3rd party libraries
import React, { useState } from 'react';

// Workspace libraries
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { ExternalOrganizationsTable } from '@thor-frontend/features/real-estates/components/external-organizations-table';
import { useRealEstateExternalOrganizations } from '@thor-frontend/features/real-estates/queries/external-organizations/real-estate-external-organizations';
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { ShareWithOrganizationModal } from '@thor-frontend/features/real-estates/modals/share-with-organization';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id'
import { useOrganization } from '@thor-frontend/features/organizations/queries'


export type IExternalOrganizationsListModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  realEstateId: string;
};

/**
 * Component description
 */
export const ExternalOrganizationsListModal: React.FC<IExternalOrganizationsListModalProps> = (
  props
) => {

  const userId = useCurrentUser().data?._id;
  const realEstatesQuery = useRealEstates(userId);
  const externalOrganizationsQuery = useRealEstateExternalOrganizations(props.realEstateId);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const organizationId = useOrganizationId();
  const organizationsQuery = useOrganization(organizationId);
  const organization = organizationsQuery.data;

  const unionName = realEstatesQuery.data?.find?.(
    (x) => x._id === props.realEstateId
  )?.unionName;

  const isLoading = [realEstatesQuery, externalOrganizationsQuery].some(
    (x) => x.status === 'loading' && x.isFetching
  );

  const content = () => {
    if (isLoading) {
      return <UpsiteLogoLoader />;
    }

    const externalOrganizations = externalOrganizationsQuery.data ?? [];

    const plural = externalOrganizations.length !== 1;

    return (
      <>
        <ModalHeader
          onRequestClose={() => props.setIsOpen(false)}
          title={`Delt med`}
        ></ModalHeader>

        <p className="mb-2">
          {externalOrganizations.length} {plural ? 'eksterne organisationer' : 'ekstern organisation'} har adgang til {unionName}.
        </p>
        {externalOrganizations.length === 0
          ? ''
          : <ExternalOrganizationsTable
            realEstateId={props.realEstateId}
            organizations={externalOrganizationsQuery.data}
          />}
        <UpsiteButton
          onClick={() => setModalIsOpen(true)}
          type="secondary"
          className="mt-8"
        ><i className="text-xl ri-share-line text-black" /> Del ejendom</UpsiteButton>

        {
          modalIsOpen &&
          <ShareWithOrganizationModal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            organizationName={organization?.name}
            realEstateId={props.realEstateId}
          />
        }
      </>
    );
  };

  return (
    <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      {content()}
    </Modal>
  );
};
