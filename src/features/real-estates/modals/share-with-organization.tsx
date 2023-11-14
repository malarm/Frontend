// 3rd party libraries
import React, { useEffect, useMemo, useState } from 'react';

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
import { useOrganization } from '@thor-frontend/features/organizations/queries';
import { getOrganizationByEmail, useOrganizationByEmail } from '@thor-frontend/features/organizations/queries/organization-by-email';
import { Infobox } from '@thor-frontend/common/infobox/infobox';
import { useCreateRealEstateExternalOrganization } from '@thor-frontend/features/real-estates/queries/external-organizations/create-real-estate-external-organization';



export type IShareWithOrganizationModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  organizationName?: string;
  realEstateId: string
};

/**
 * Component description
 */
export const ShareWithOrganizationModal: React.FC<
  IShareWithOrganizationModalProps
> = (props) => {
  const organizationId = useOrganizationId();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrganizationRole>('read-only');
  const [externalOrgId, setExternalOrgId] = useState('');
  const [showInfoBox, setShowInfoBox] = useState(false);


  const reset = () => setEmail('');

  const validateOrgEmail = () => {
    if (email !== '') {
      getOrganizationByEmail(email)
        .then(response => {
          setExternalOrgId(response.data._id);
          setShowInfoBox(false);
        })
        .catch(x => {
          setExternalOrgId('');
          setShowInfoBox(true)
        })
    } else {
      setExternalOrgId('');
      setShowInfoBox(false)
    }
  }

  useEffect(() => {
    validateOrgEmail()
  }, [email])

  const createRealEstateExternalOrganizationQuery = useCreateRealEstateExternalOrganization();

  const isLoading = () => createRealEstateExternalOrganizationQuery.isLoading;

  const isValid = () => email.length > 0 && externalOrgId.length > 0;

  const submit = async () => {
    try {
      await createRealEstateExternalOrganizationQuery.mutateAsync({
        realEstateId: props.realEstateId,
        dto: {
          role: role === OrganizationRole.Editor ? OrganizationRole.Editor : OrganizationRole.ReadOnly,
          organizationId: externalOrgId
        },
      });

      toast.success('Del med organisation tilføjet!');

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
      {/* Modal Header */}
      <ModalHeader
        onRequestClose={() => props.setIsOpen(false)}
        title="Del med organisation"
      />
      {/* explainer */}
      <p className="text-black mb-5">
        Del {props.organizationName ?? 'organisation'} med en ekstern organisation. Alle organisationens brugere får adgang med den brugerrettighed du vælger.
      </p>

      {/* email input */}
      <InputWithLabel
        label={'1. Indtast email'}
        inputProps={{
          onInput: (e) => {
            setEmail(e.currentTarget.value)
          },
          placeholder: 'mail@mail.dk',
          autoComplete: 'email',
          name: 'email'
        }}
        beforeInput={
          <i className="ri-mail-send-line text-[20px] text-neutral-500 leading-[20px]"></i>
        }
      />
      {
        showInfoBox && <Infobox className='mt-2'>
          <p className=''>The email you have entered is not associated with an Upside user. Contact us to establish this access.</p>
        </Infobox>
      }

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
        btnText="Del med organisation"
        loading={isLoading()}
        disabled={!isValid()}
        confirmHandler={submit}
      />
    </Modal>
  );
};
