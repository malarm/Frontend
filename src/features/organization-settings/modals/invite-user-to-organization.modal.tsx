// 3rd party libraries
import React, { useState } from 'react';

// Workspace libraries
import { getErrorMessage } from '@project/ui/get-error-message';
import { OrganizationRole } from '@project/shared/feature-organizations/enums/organization-role.enum';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import toast from '@thor-frontend/common/utils/toast';
import { RoleItem } from '@thor-frontend/features/organization-settings/components/role-item';
import { useCreateOrganizationInvitation } from '@thor-frontend/features/organization-settings/queries/create-organization-invitation';



export type IInviteUserToOrganizationModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  organizationName?: string;
};

/**
 * Component description
 */
export const InviteUserToOrganizationModal: React.FC<
  IInviteUserToOrganizationModalProps
> = (props) => {
  const organizationId = useOrganizationId();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrganizationRole>('read-only');

  const reset = () => setEmail('');

  const createInvitationQuery = useCreateOrganizationInvitation();

  const isLoading = () => createInvitationQuery.isLoading;

  const isValid = () => email.length > 0;

  const submit = async () => {
    try {
      await createInvitationQuery.mutateAsync({
        email,
        organizationId,
        role,
      });

      toast.success('Bruger tilføjet!');

      props.setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      widthClassName="w-[600px] max-w-full"
    >
      {/* <div className="p-8 grid grid-flow-row"> */}
      {/* Modal Header */}
      <ModalHeader
        onRequestClose={() => props.setIsOpen(false)}
        title="Indtast email"
      />
      {/* explainer */}
      <p className="text-black mb-5">
        Tilføj en bruger til {props.organizationName ?? 'organisation'}.
        Brugeren får adgang til alle ejendomme med den brugerrettighed du
        vælger.
      </p>

      {/* email input */}
      <InputWithLabel
        label={'1. Indtast email'}
        inputProps={{
          onInput: (e) => setEmail(e.currentTarget.value),
          placeholder: 'mail@mail.dk',
          autoComplete: 'email',
          name: 'email'
        }}
        beforeInput={
          <i className="ri-mail-send-line text-[20px] text-neutral-500 leading-[20px]"></i>
        }
      />

      {/* choose role */}
      <div className="flex flex-col gap-2 mt-6">
        <h2 className="text-neutral-500 text-sm font-medium mb-1">
          2. Vælg brugerrettighed
        </h2>
        {/* Read only */}
        <RoleItem
          checked={role === 'read-only'}
          onClick={() => setRole('read-only')}
          roleName={'Read only'}
          roleDescription={'Kan se men ikke ændre'}
        />

        {/* Editor */}
        <RoleItem
          checked={role === 'editor'}
          onClick={() => setRole('editor')}
          roleName={'Editor'}
          roleDescription={'Kan se og ændre'}
        />

        {/* Admin */}
        <RoleItem
          checked={role === 'admin'}
          onClick={() => setRole('admin')}
          roleName={'Admin'}
          roleDescription={
            'Kan se og ændre samt styre adgange og indstillinger'
          }
        />
      </div>

      {/* buttons */}
      <ModalTwoButtons
        cancelBtnText="Annuller"
        onRequestClose={() => {
          reset();
          props.setIsOpen(false);
        }}
        cancelColor="secondary"
        cancelTextColor="text-neutral-700 "
        btnText="Send invitation"
        loading={isLoading()}
        disabled={!isValid()}
        confirmHandler={submit}
      />
    </Modal>
  );
};
