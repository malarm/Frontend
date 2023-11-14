import { capitalize } from '@project/shared/common/utils/capitalize.util'
import { humanOrganizationRole } from '@project/shared/feature-organizations/enums/organization-role.enum';
;
import { UserAvatar } from '@thor-frontend/common/avatar/user-avatar';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { useRealEstateExternalUsers } from '@thor-frontend/features/real-estates/queries/external-users/real-estate-external-users';
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { ShortUserTable } from '@thor-frontend/features/users/components/short-user-table';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import React from 'react';

export type IExternalUsersListModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  realEstateId: string;
};

/**
 * Component description
 */
export const ExternalUsersListModal: React.FC<IExternalUsersListModalProps> = (
  props
) => {
  const userId = useCurrentUser().data?._id;
  const realEstatesQuery = useRealEstates(userId);
  const externalUsersQuery = useRealEstateExternalUsers(props.realEstateId);

  const unionName = realEstatesQuery.data?.find?.(
    (x) => x._id === props.realEstateId
  )?.unionName;

  const isLoading = [realEstatesQuery, externalUsersQuery].some(
    (x) => x.status === 'loading' && x.isFetching
  );

  const content = () => {
    if (isLoading) {
      return <UpsiteLogoLoader />;
    }

    const externalUsers = externalUsersQuery.data ?? [];

    const plural = externalUsers.length !== 1;

    return (
      <>
        <ModalHeader
          onRequestClose={() => props.setIsOpen(false)}
          title={`Delt med`}
        ></ModalHeader>

        <p className="mb-2">
          {externalUsers.length} {plural ? 'brugere' : 'bruger'} uden for din
          organisation har adgang til {unionName}.
        </p>

        <ShortUserTable
          users={externalUsers.map(x => ({
            ...x,

          }))}
        />
      </>
    );
  };

  return (
    <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      {content()}
    </Modal>
  );
};
