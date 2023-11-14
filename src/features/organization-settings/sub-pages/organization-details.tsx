// 3rd party libraries
import React, { useEffect, useMemo, useState } from 'react';

// Workspace libraries
import { MEImage } from '@project/ui';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useDeleteOrganizationLogo, useOrganization, useUpdateOrganizationLogo, } from '@thor-frontend/features/organizations/queries';
import toast from '@thor-frontend/common/utils/toast';
import { getDocumentUrl } from '@thor-frontend/common/utils';
import SettingsSubPage from '@thor-frontend/features/organization-settings/components/organizations-setings-sub-page-layout';
import UpdateOrganizationModal from '@thor-frontend/features/organization-settings/modals/update-organization.modal';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { useConfirm } from '@project/ui/confirm';



const OrganizationDetails: React.FC = () => {
  const currentUser = useCurrentUser().data;
  const organizationsQuery = useOrganization(
    currentUser?.organizations[0]?.organizationId
  );
  const updateOrgLogo = useUpdateOrganizationLogo();
  const deleteOrgLogo = useDeleteOrganizationLogo();

  const getOrganization = useMemo(
    () => () => organizationsQuery.data,
    [organizationsQuery.data]
  );

  const organizations = getOrganization();
  const [name, setName] = useState(organizations?.name);
  const [cvrNumber, setCvrNumber] = useState(organizations?.cvrNumber);
  const [addressString, setAddressString] = useState(
    organizations?.addressString
  );
  const [zip, setZip] = useState(organizations?.zip);
  const [phone, setPhone] = useState(organizations?.phone);
  const [email, setEmail] = useState(organizations?.email);
  const [showEditdetailsList, setshowEditdetailsList] = React.useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    setName(organizations?.name);
    setCvrNumber(organizations?.cvrNumber);
    setAddressString(organizations?.addressString);
    setZip(organizations?.zip);
    setPhone(organizations?.phone);
    setEmail(organizations?.email);
  }, [organizations]);

  const LabelValue = (label: string, value: string) => {
    return (
      <>
        <div className="text-neutral-500 text-sm font-medium">{label}</div>
        <div className="text-black mt-1 ">
          {value === '' || value === null || value === undefined ? '-' : value}
        </div>
      </>
    );
  };

  const deleteLogo = async () => {
    try {
      await deleteOrgLogo.mutateAsync(String(organizations?._id));
      toast.success('Sådan! Dit logo er blevet slettet!');
    } catch (err) {
      toast.error('Der opstod en uventet fejl. Dit logo blev ikke slettet.');
    }
  };

  const logoHandler = async (e) => {
    try {
      await updateOrgLogo.mutateAsync({
        organizationId: String(organizations?._id),
        file: e.target.files[0],
      });

      toast.success('Sådan! Dit logo er blevet opdateret!');
    } catch (err) {
      toast.error('Der opstod en uventet fejl. Dit logo blev ikke opdateret.');
    }
  };

  const renderLogo = () => {
    if (!organizations) return <UpsiteLogoLoader />;

    // logo missing, show mint bg and upload button
    if (!organizations.logo) {
      return (
        <div className="bg-mint w-[600px] h-[160px] rounded-xl flex flex-col justify-center align-center relative">
          <UpsiteButton onClick={() => inputFile?.current?.click()}><i className="text-xl ri-upload-line" /> Upload logo</UpsiteButton>
          <span className="mt-4 text-sm text-black">
            Minimum 400px bredde (.png format)
          </span>
        </div>
      );
    }

    // logo present, show logo (and buttons on hover)
    return (
      <div
        // 600x160
        className="w-full max-w-[600px] h-[160px] bg-neutral-800 bg-opacity-5 rounded-xl grid place-content-center"
      >
        <ThorImage
          className="group relative"
          imgClassName=""
          bgClassName=""
          src={getDocumentUrl(organizations.logo)}
          dimensions="360w"
          sizeClassName="h-[80px] w-full"
        >
          <div className="absolute group-hover:grid hidden inset-0 place-content-center grid-flow-col gap-2">
            <UpsiteButton
              onClick={() => inputFile?.current?.click()}
              type="secondary"
              className="mr-4"
            ><i className="text-xl ri-upload-line cursor-pointer" />
              Skift
            </UpsiteButton>
            <UpsiteButton onClick={async (e) => {
              e.stopPropagation();

              const wasConfirmed = await confirm({
                title: 'Slet logo',
                body: 'Er du sikker på du vil slette logoet?',
                rightButtonColor: 'delete',
              });

              if (!wasConfirmed) return;
              await deleteLogo();
            }} type="danger">
              <i className="ri-delete-bin-line text-[20px] leading-[20px]"></i>
            </UpsiteButton>
          </div>
        </ThorImage>
      </div>
    );
  };

  // Ref
  const inputFile = React.useRef(null);

  return (
    <>
      {/* Modals */}
      <UpdateOrganizationModal
        isOpen={showEditdetailsList}
        onRequestClose={() => setshowEditdetailsList(false)}
        confirmHandler={() => null}
      />
      <SettingsSubPage title="Organisation">
        <div className="mb-4  mx-8">
          <input
            ref={inputFile}
            className="hidden"
            id="file-upload-profile"
            type="file"
            accept="image/png, image/jpeg"
            onChange={logoHandler}
          />

          {renderLogo()}

          <div className="grid grid-cols-2 gap-x-4 mb-8 mt-5 w-[600px] border border-neutral-200 rounded-xl p-8 ">
            <div className="col-span-2">
              {LabelValue('Navn på organisation', name)}
            </div>
            <div className="col-span-2 mt-6">
              {LabelValue('Adresse', addressString)}
            </div>
            <div className="col-span-2 mt-6">
              {LabelValue('Postnr. & by', zip)}
            </div>
            <div className="col-span-2 mt-6">
              {LabelValue('Telefon', phone)}
            </div>
            <div className="col-span-2 mt-6">{LabelValue('Email', email)}</div>
            <div className="col-span-2 mt-6">{LabelValue('CVR-nr.', cvrNumber)}</div>
            <UpsiteButton
              onClick={() => {
                setshowEditdetailsList(true);
              }}
              type="secondary"
              className="mt-8"
            ><i className="text-xl ri-edit-line text-black" /> Rediger oplysninger</UpsiteButton>

          </div>
        </div>
      </SettingsSubPage>
    </>
  );
};

export default OrganizationDetails;
