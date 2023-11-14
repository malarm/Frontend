// 3rd party libraries
import React from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { useUpdateMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/update-maintenance-plan-version';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import MaintenancePlanTopNavigation from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-top-navigation';
import EditMaintenancePlanTopBtns from '@thor-frontend/features/real-estates/components/edit-maintenance-plan-top-btns';
import { Join } from '@project/shared/common/types/join.type'
import { OrganizationInvitationJSON } from '@project/shared/feature-organization-invitations/types/organization-invitation.type'
import { OrganizationRole } from '@project/shared/feature-organizations/enums/organization-role.enum'
import { OrganizationType } from '@project/shared/feature-organizations/enums/organization-type.enum'
import { OrganizationUserJSON } from '@project/shared/feature-organizations/types/organization-user.type'
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import MaintenancePlanButton from '@thor-frontend/features/maintenance-plan-versions/maintenance-plan-button';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { useOrganization } from '@thor-frontend/features/organizations/queries';
import { UserAvatar } from '@thor-frontend/common/avatar/user-avatar';
import MaintenancePlanHeader from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-edit-header';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { useUserByUsername } from '@thor-frontend/features/users/queries/user-by-username';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { getCDNUrl } from '@thor-frontend/common/utils/get-cdn-url';
import { getUserProfilePictureUrl } from '@thor-frontend/common/utils/get-user-profile-picture-url';
import { useAddedEmailStore } from '@thor-frontend/features/maintenance-plan-versions/store/save-added-email.store';
import { useOrganizationInvitations } from '@thor-frontend/features/organization-settings/queries/organization-invitations';
import { UserNameBadge } from '@thor-frontend/features/users/components/user-name-badge';



const MaintenancePlanPublish = () => {
  // Params
  // State
  const [email, setEmail] = React.useState('');
  const addedEmail = useAddedEmailStore((x) => x.email);
  const setAddedEmail = useAddedEmailStore((state) => state.setEmail);
  // Hooks

  const history = useHistory()

  const user = useCurrentUser()
  const realEstateId = useRealEstateId();
  const editableMaintenancePlanQuery = useEditableMaintenancePlan(realEstateId);
  const liveMaintenancePlanQuery = useLiveMaintenancePlan(realEstateId);
  const realEstate = useRealEstateById(realEstateId);
  const realEstateOrganizationQuery = useOrganization(realEstate.data?.organization?.organizationId);
  const userOrganizationQuery = useOrganization(user.data?.organizations?.[0]?.organizationId)
  const invitationsQuery = useOrganizationInvitations(realEstate.data?.organization?.organizationId)

  const addedUserQuery = useUserByUsername(addedEmail)

  /**
   * True if the real estate is related to the current users organization
   */
  const isOwnOrganization = realEstate.data?.organization.organizationId
    === user.data?.organizations?.[0]?.organizationId

  const ownOrganizationIsPartner = userOrganizationQuery.data?.organizationType === OrganizationType.Partner

  const isLoading = () => {
    if (editableMaintenancePlanQuery.status === 'loading') return true
    if (liveMaintenancePlanQuery.status === 'loading') return true

    if (realEstate.data?.organization?.organizationId
      && realEstateOrganizationQuery.status === 'loading') return true;

    return false
  }

  const adminUsers = () => {
    if (isOwnOrganization && ownOrganizationIsPartner) return []

    const users = realEstateOrganizationQuery.data?.users ?? []
    const invitations = invitationsQuery.data ?? []

    if (!realEstateOrganizationQuery.data) return []

    return [
      ...users.map(x => Object.assign({ isInvitation: false }, x)),
      ...invitations.map(x => Object.assign({ isInvitation: true }, x)),
    ] as Array<{ isInvitation: boolean } & Join<OrganizationUserJSON, OrganizationInvitationJSON>>

  }

  const hasAdmin = () => adminUsers().length > 0


  const shareContent = () => {
    if (hasAdmin()) {
      return (
        <>
          <p className="mb-4 text-base">
            Følgende brugere er registreret som ejendomsejere på denne ejendom
            og modtager e-mail om, at vedligeholdelsesplanen nu kan tilgås i
            Upsite.
          </p>
          {adminUsers()
            .map((x) => {

              const isSelf = x.userId && x.userId === user.data?._id

              return x.isInvitation
                ? <div className={`w-full bg-white mb-2 border-slate border rounded-lg py-3 px-4 flex justify-between ${isSelf ? 'opacity-50' : ''}`}>
                  <div className="flex">
                    <UserAvatar
                      className="item-center self-center mr-4"
                      roundedClassName="rounded-lg"
                    />
                    <div className="flex flew-row gap-2 items-center">
                      <p className="font-bold text-base">{x.email}</p>
                      <UserNameBadge bgClassName="bg-mortar">Inviteret</UserNameBadge>
                    </div>
                  </div>
                </div>
                : <div className={`w-full bg-white mb-2 border-slate border rounded-lg py-3 px-4 flex justify-between ${isSelf ? 'opacity-50' : ''}`}>
                  <div className="flex">
                    <UserAvatar
                      className="item-center self-center mr-4"
                      url={getUserProfilePictureUrl(x)}
                      roundedClassName="rounded-lg"
                    />
                    <div>
                      <p className="font-bold text-base flex flew-row gap-2 items-center">{x.name} {isSelf ? <div className="bg-mint rounded-lg text-black text-xs px-2 py-1 font-medium">Dig</div> : ''}</p>
                      <p className="text-neutral-500 text-sm">{x.username}</p>
                    </div>
                  </div>
                </div>
            })}
        </>
      );
    } else {
      return (
        <>
          <div className="p-4 bg-mortar rounded-xl flex mb-4">
            <i className="ri-error-warning-line text-xl mr-2" />
            <p className="text-sm mt-0.5">
              Der er ikke registreret en ejendomsejer på denne ejendom. Indtast
              email på modtager, så sender vi en besked om, at
              vedligeholdelsesplanen nu kan tilgås i Upsi±e.
            </p>
          </div>

          {/* email input */}
          {addedEmail === '' &&
            <div className='flex align-bottom'>
              <div className='grow mr-2'>
                <InputWithLabel
                  label={'Email'}
                  inputContainerClassName="bg-white px-4 py-2 rounded-xl"
                  inputProps={{
                    onInput: (e) => setEmail(e.currentTarget.value),
                    placeholder: 'mail@mail.dk',
                    value: email
                  }}
                />
              </div>
              <UpsiteButton isDisabled={publishButtonIsDisabled()} onClick={() => setAddedEmail(email)} className="cursor-pointer">Tilføj</UpsiteButton>
            </div>
          }
          {
            addedEmail !== '' &&
            <div className={`w-full bg-white mb-2 border-slate border rounded-lg py-3 px-4 flex justify-between `}>
              <div className="flex items-center">
                <UserAvatar
                  className="item-center self-center mr-4"
                  sizeClassName={'w-8 h-8'}
                  url={getUserProfilePictureUrl(addedUserQuery.data)}
                  roundedClassName="rounded-lg"
                />
                <div className='flex flex-col -my-2'>
                  {(addedUserQuery.data && addedUserQuery.data.name)
                    ? <>
                      <p className="font-medium text-base text-black leading-tight">{addedUserQuery.data.name}</p>
                      <p className="text-sm text-neutral-500 leading-tight">{addedEmail}</p>
                    </>
                    : <p className="font-medium text-base text-black">{addedEmail}</p>}
                </div>
              </div>
              <p onClick={() => {
                setAddedEmail('');
                setEmail('')
              }
              }>
                < i className="ri-close-line text-neutral-500 text-[24px] cursor-pointer hover:text-black "></i>
              </p>
            </div>
          }
        </>
      );
    }
  };

  const content = () => {
    if (isLoading()) {
      return (
        <div className="flex justify-center mt-16">
          <UpsiteLogoLoader />
        </div>
      );
    }

    return (
      <div>
        <MaintenancePlanHeader title="Udgiv" />
        <div className="mb-6" />
        <div className="flex w-full justify-between">
          <div className="mr-4 flex-1 rounded-xl bg-neutral-100 p-8">
            <p className="text-lg font-medium mb-2">Deling</p>
            {shareContent()}
          </div>
          <div className="rounded-xl flex-1 bg-neutral-100 p-8">
            <p className="text-lg font-medium mb-2">Forhåndsvisning</p>
            <p className="mb-4 text-base">
              Se forhåndsvisning af vedligeholdelsesplanen i PDF, inden du
              udgiver den færdige rapport.
            </p>
            <MaintenancePlanButton
              onClick={() => {
                window.open(window.location.origin + ThorPaths.MAINTENANCE_PLAN_VIEW + '/' + editableMaintenancePlanQuery.data?._id, '_blank')
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const publishButtonIsDisabled = () => {
    if (isLoading()) return true;

    if (
      !hasAdmin() &&
      // Email Regex
      !/^[a-zA-Z0-9._%-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    )
      return true;

    return false;
  };

  return (
    <RealEstateSubPage
      title="Vedligeholdelsesplan"
      topBarChildren={
        <>
          {/* Buttons */}
          <EditMaintenancePlanTopBtns
            stepsDto={{ isConclusionConfirmed: true }}
            // nextBtnUrlPath={ThorSubPaths.MAINTENANCE_CONCLUSION}
            prevBtnUrlPath={ThorSubPaths.MAINTENANCE_CONCLUSION}
            autoSaving={isLoading()}
            hasPublishHandler
            publishButtonIsDisabled={!hasAdmin() && addedEmail === ''}
            invitedEmail={addedEmail}
          />
        </>
      }
    >
      <MaintenancePlanContentWrapper>{content()}</MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlanPublish;
