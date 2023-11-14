// 3rd party libraries
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';

// Workspace libraries
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useOrganization,  useUpdateOrganization, } from '@thor-frontend/features/organizations/queries';
import toast from '@thor-frontend/common/utils/toast';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

const UpdateOrganizationModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // State
  const currentUser = useCurrentUser().data;
  const organizationsQuery = useOrganization(
    currentUser?.organizations[0]?.organizationId
  );
  const updateOrg = useUpdateOrganization();
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
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    setName(organizations?.name);
    setCvrNumber(organizations?.cvrNumber);
    setAddressString(organizations?.addressString);
    setZip(organizations?.zip);
    setPhone(organizations?.phone);
    setEmail(organizations?.email);
  }, [organizations]);

  useEffect(() => {
    setDisableButton(
      organizations?.name === name &&
      organizations?.cvrNumber === cvrNumber &&
      organizations?.addressString === addressString &&
      organizations?.zip === zip &&
      organizations?.phone === phone &&
      organizations?.email === email
    );
  }, [name, cvrNumber, addressString, zip, phone, email]);

  // Functions
  const editHandler = async () => {
    const resp = await updateOrg.mutateAsync({
      organizationId: String(organizations?._id),
      dto: {
        name: name,
        cvrNumber: cvrNumber,
        addressString: addressString,
        zip: zip,
        phone: phone,
        email: email,
      },
    });
    // console.log(resp);
    toast.success('Organisation blev redigeret.');
    closeHandler();
  };

  const closeHandler = () => {
    props.onRequestClose();
  };

  const loading = false;
  // Return
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader title="Rediger organisation" onRequestClose={closeHandler} />

      {/* // Input */}
      <div className="grid gap-x-4 ">
        <div>
          <InputWithLabel
            inputProps={{
              value: name,
              onChange: (e) => setName((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'name',
            }}
            label={'Navn på organisation'}
          />
        </div>
        <div className="mt-2">
          <InputWithLabel
            inputProps={{
              value: addressString,
              onChange: (e) =>
                setAddressString((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'addressString',
            }}
            label={'Adresse'}
          />
        </div>
        <div className="mt-2">
          <InputWithLabel
            inputProps={{
              value: zip,
              onChange: (e) => setZip((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'zip',
            }}
            label={'Postnr. & by'}
          />
        </div>
        <div className="mt-2">
          <InputWithLabel
            inputProps={{
              value: phone,
              onChange: (e) => setPhone((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'phone',
            }}
            label={'Telefon'}
          />
        </div>
        <div className="mt-2">
          <InputWithLabel
            inputProps={{
              value: email,
              onChange: (e) => setEmail((e.target as HTMLInputElement).value),
              type: 'lastname',
              name: 'email',
            }}
            label={'Email'}
          />
        </div>
        <div className="mt-2">
          <InputWithLabel
            inputProps={{
              value: cvrNumber,
              onChange: (e) =>
                setCvrNumber((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'cvrNumber',
            }}
            label={'CVR-nr.'}
          />
        </div>
      </div>
      <ModalTwoButtons
        cancelBtnText="Annuller"
        onRequestClose={closeHandler}
        cancelColor="secondary"
        cancelTextColor="text-neutral-700 "
        btnText="Bekræft"
        loading={loading}
        disabled={disableButton}
        confirmHandler={editHandler}
      />
    </Modal>
  );
};

export default UpdateOrganizationModal;
