// 3rd party libraries
import React, { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';

// Workspace libraries
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import SearchInput from '@thor-frontend/common/search-input/search-input';
import RealEstateListItem from '@thor-frontend/features/real-estates/real-estate-list-item.component';
import RealEstateCreateModal from '@thor-frontend/features/real-estates/create-real-estate.modal';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { TopBar } from '@thor-frontend/features/layouts/top-bar';
import { useOrganization } from '@thor-frontend/features/organizations/queries';
import BrandedUpsiteLoadingModal from '@thor-frontend/features/real-estates/modals/branded-loaded-loading.modal';
import { useCreateRealEstatesAsync } from '@thor-frontend/features/real-estates/queries/create-real-estate';
import toast from '@thor-frontend/common/utils/toast';
import { organizationCanCreateRealEstates } from '@project/shared/feature-organizations/access-control/organization-can-create-real-estates';
import { ExternalOrganizationsListModal } from '@thor-frontend/features/real-estates/modals/external-organizations-list-modal';
import { getRealEstateByAddress } from '@thor-frontend/features/real-estates/queries/real-estate-by-address';
import { getErrorMessage } from '@project/ui/get-error-message';



export const RealEstatesPage = () => {
  // State
  const [showCreateRealEstate, setShowCreateRealEstate] = React.useState(false);
  const [createEstateErrorMessage, setCreateEstateErrorMessage] =
    React.useState('');
  // Queries
  const userQuery = useCurrentUser();
  const realEstatesQuery = useRealEstates(userQuery.data?._id);
  const createRealEstate = useCreateRealEstatesAsync();

  const organizationQuery = useOrganization(
    userQuery.data?.organizations[0]?.organizationId
  );

  // state
  const [searchPhrase, setSearchPhrase] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [showBrandedLoading, setShowBrandedLoading] = React.useState(false);
  const [sharedWithIsOpen, setSharedWithIsOpen] = useState(false);
  const [currentRealEstateId, setCurrentRealEstateId] = useState('');

  // Functions
  const submitCreateRealEstate = async (addressId: string) => {
    setCreateEstateErrorMessage('');

    try {
      setLoading(true);

      if (!addressId) {
        setCreateEstateErrorMessage('Vælg venligst en adresse fra dropdownen.');
        return;
      }

      // Check if there is an existing real estate
      const estateByAddressRes = await getRealEstateByAddress(addressId).catch(
        (error) => error as AxiosError
      );

      let error = '';

      if (isAxiosError(estateByAddressRes)) {
        if (estateByAddressRes.response?.status !== 404) {
          error = getErrorMessage(estateByAddressRes);
        }
      } else if (estateByAddressRes.data.organization) {
        const ownOrganizationId =
          userQuery.data?.organizations?.[0]?.organizationId;

        // check if real estate is connected to own org
        if (
          estateByAddressRes.data.organization.organizationId ===
          ownOrganizationId
        ) {
          error = `Ejendommen tilhører allerede din organisation.`;
        } else {
          error = `Ejendommen tilhører allerede en anden organisation, ${estateByAddressRes.data.organization.name}. Kontakt denne for at få adgang.`;
        }
      }

      if (error) {
        setCreateEstateErrorMessage(error);
        return;
      }

      const delayRequest = new Promise((resolve) => setTimeout(resolve, 20000)); // 20 sec
      setShowBrandedLoading(true);

      await Promise.all([
        await createRealEstate.mutateAsync({
          addressId,
        }),
        delayRequest,
      ]);
      realEstatesQuery.refetch();
      setShowBrandedLoading(false);
      setShowCreateRealEstate(false);
      setSearchPhrase('');
      toast.success('Ejendom oprettet 👍');
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          'Noget gik galt. Kontakt os hvis det er en fejl og problemet fortsætter 😊'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const onSharedWithClicked = (realEstateId: string) => {
    setSharedWithIsOpen(true);
    setCurrentRealEstateId(realEstateId);
  };

  const canCreateRealEstates =
    organizationQuery.data &&
    organizationCanCreateRealEstates(
      organizationQuery.data,
      organizationQuery.data.realEstates.length
    );

  const realEstates = (() => {
    if (searchPhrase) {
      const regex = new RegExp(searchPhrase, 'i');

      return realEstatesQuery.data.filter(
        (x) =>
          regex.test(x.unionName) ||
          regex.test(x.municipality) ||
          regex.test(x.zipcode)
      );
    }

    return realEstatesQuery.data;
  })().sort((a, b) => {
    if (!a.unionName) return 1;
    if (!b.unionName) return 1;
    return a.unionName.localeCompare(b.unionName);
  });

  // Return
  return (
    <>
      {/* Page Content */}
      <div className={'grow flex flex-col h-screen'}>
        <TopBar title={'Ejendomme'} />
        {!realEstatesQuery.isPlaceholderData && (
          <div className="h-full overflow-auto">
            <div className="flex">
              <div className="grow">
                {realEstatesQuery.data.length > 0 ? (
                  <>
                    <div className="px-8 flex justify-between">
                      <UpsiteButton
                        isDisabled={!canCreateRealEstates}
                        onClick={() => {
                          setShowCreateRealEstate(true);
                        }}
                        disabledText="Kontakt os for at oprette flere ejendomme"><i className="text-xl ri-add-line" /> Tilføj ejendom</UpsiteButton>
                      <SearchInput
                        showIcon
                        value={searchPhrase}
                        onChange={(e) => setSearchPhrase(e.currentTarget.value)}
                      />
                    </div>

                    <div
                      className="relative mt-6 px-8"
                      style={{
                        height: 'calc(100vh - 195px)',
                        overflow: 'auto',
                      }}
                    >
                      <div className="flex justify-between bg-white sticky pb-5 py-4 px-4 z-10 top-0">
                        <p className="text-neutral-500 text-sm w-6/12 font-medium ml-[66px] -mr-[66px]">
                          Navn
                        </p>
                        <p className="text-neutral-500 text-sm w-2/12 font-medium ">
                          Udgifter pr. m² pr. år
                        </p>
                        <p className="text-neutral-500 text-sm w-2/12 font-medium ">
                          Energimærke
                        </p>
                        <p className="text-neutral-500 text-sm w-2/12 font-medium">
                          Delt med
                        </p>
                        <p className="text-neutral-500 text-sm w-2/12 font-medium text-right"></p>
                      </div>
                      {/* Loop Real Estate Items */}
                      {realEstates.map((el, index) => {
                        return (
                          <RealEstateListItem
                            key={el._id}
                            index={index}
                            item={el}
                            onSharedWithClicked={() =>
                              onSharedWithClicked(el._id)
                            }
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-[328px] bg-mortar rounded-xl flex justify-between mx-8 ">
                    {/* Content */}
                    <div className="w-3/5 max-w-2xl p-14 pr-4">
                      <p className="text-2xl mb-4">Tilføj din første ejendom</p>
                      <p className="text-base mb-4">
                        Kom i gang med din ejendomsportefølje og begynd at lave
                        vedligeholdelsesplaner med grøn indsigt og ambition.
                      </p>
                      <UpsiteButton onClick={() => {
                        setShowCreateRealEstate(true);
                      }}>{'Kom i gang'}</UpsiteButton>
                    </div>
                    <div className="p-14 pr-0">
                      <img
                        className="max-h-full max-w-full w-auto h-auto"
                        alt="opret-vp-illustration"
                        src="assets/images/no-realestates.png"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RealEstateCreateModal
        isOpen={showCreateRealEstate && !showBrandedLoading}
        onRequestClose={() => {
          setShowCreateRealEstate(false);
          setCreateEstateErrorMessage('');
        }}
        confirmHandler={(addressId: string) =>
          submitCreateRealEstate(addressId)
        }
        errorMessage={createEstateErrorMessage}
        loading={loading}
      />

      <BrandedUpsiteLoadingModal
        isOpen={showBrandedLoading}
        intervalMiliSeconds={2150}
        publishProgressAddBy={9}
        onRequestClose={() => null}
        text="Indhenter oplysninger om ejendommen"
      />

      <ExternalOrganizationsListModal
        isOpen={sharedWithIsOpen}
        setIsOpen={setSharedWithIsOpen}
        realEstateId={currentRealEstateId}
      />
    </>
  );
};
