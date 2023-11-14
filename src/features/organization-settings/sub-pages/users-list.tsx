// 3rd party libraries
import classNames from 'classnames';
import { useState } from 'react';

// Workspace libraries
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { UserAvatar } from '@thor-frontend/common/avatar/user-avatar';
import SettingsSubPage from '@thor-frontend/features/organization-settings/components/organizations-setings-sub-page-layout';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { InviteUserToOrganizationModal } from '@thor-frontend/features/organization-settings/modals/invite-user-to-organization.modal';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id';
import { useOrganization } from '@thor-frontend/features/organizations/queries';
import { useOrganizationInvitations } from '@thor-frontend/features/organization-settings/queries/organization-invitations';
import { ShortUserTable } from '@thor-frontend/features/users/components/short-user-table';
import { organizationCanAddUsers } from '@project/shared/feature-organizations/access-control/organization-can-add-users'
import { OrganizationType } from '@project/shared/feature-organizations/enums/organization-type.enum';



export interface UserImageProps {
  user: any;
}

const UsersList: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const organizationId = useOrganizationId();
  const organizationsQuery = useOrganization(organizationId);
  const organization = organizationsQuery.data;

  const invitationsQuery = useOrganizationInvitations(organizationId);

  const invitations = invitationsQuery.data;

  const canInviteUsers = organization
    && organizationCanAddUsers(organization, organization.users.length)

  return (
    <SettingsSubPage title="Brugere">
      <InviteUserToOrganizationModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        organizationName={organization?.name}
      />

      <div className="mx-8">
        <p className="mb-4 flex flex-row justify-items-start">
          <UpsiteButton isDisabled={!canInviteUsers} onClick={() => setModalIsOpen(true)} disabledText="Kontakt os for at oprette flere brugere."><i className="text-xl ri-add-line" /> Tilføj bruger</UpsiteButton>
        </p>

        <ShortUserTable
          users={organization?.users ?? []}
          invitations={invitations}
        />
      </div>
    </SettingsSubPage>
  );
};

export default UsersList;
