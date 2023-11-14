// 3rd party libraries
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';

// Workspace libraries
import toast from '@thor-frontend/common/utils/toast';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { usePathParamV2 } from '@project/ui';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { useUpdateRealEstate } from '@thor-frontend/features/real-estates/queries/update-real-estate';
import { MultiInput } from '@thor-frontend/common/multi-input/multi-input';
import { formatDate } from '@project/shared/common/utils/format-date.util';
import { Modal } from '@thor-frontend/common/modal/modal';
import { parseNumber } from '@project/shared/common';



const leftPad = (str: string, minLength: number, padWith = '') => padWith.repeat(Math.max(0, minLength - str.length)) + str

export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

const UpdateBbrModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');
  const [planId] = usePathParamV2('id');

  const realEstatesById = useRealEstateById(planId);
  const realEstates = realEstatesById;
  const updateRealEstate = useUpdateRealEstate();

  const getRealEstate = useMemo(
    () => () => realEstates.data,
    [realEstates.data]
  );

  // State
  const realEstate = getRealEstate();
  const [unionName, setUnionName] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [matrNumber, setMatrNumber] = useState('');
  const [realEstateNumber, setRealEstateNumber] = useState([]);
  const [buildYear, setBuildYear] = useState(0);
  const [totalArea, setTotalArea] = useState<number | null>(null);
  const [buildingArea, setBuildingArea] = useState<number | null>(null);
  const [commercialArea, setCommercialArea] = useState<number | null>(null);
  const [residentialArea, setResidentialArea] = useState<number | null>(null);
  const [basementArea, setBasementArea] = useState<number | null>(null);
  const [floorCount, setFloorCount] = useState<number | null>(null);
  const [addonYear, setAddonYear] = useState(0)
  const [disableButton, setDisableButton] = useState(true);


  const reset = useCallback(
    () => {
      if (!realEstate) return;

      setUnionName(realEstate.unionName);
      setMunicipality(realEstate.municipality);
      setMatrNumber(realEstate.matrNumber);
      setRealEstateNumber(realEstate.realEstateNumber);

      setBuildYear(realEstate.buildDate ? new Date(realEstate.buildDate).getFullYear() : 0);

      setTotalArea(realEstate.totalArea);
      setBuildingArea(realEstate.buildingArea);
      setCommercialArea(realEstate.commercialArea);
      setResidentialArea(realEstate.residentialArea);
      setBasementArea(realEstate.basementArea);
      setFloorCount(realEstate.floorCount);

      setAddonYear(realEstate.addonDate ? new Date(realEstate.addonDate).getFullYear() : 0);
    },
    [realEstate]
  )

  useEffect(() => {
    reset()
  }, [reset]);

  useEffect(() => {
    setDisableButton(
      realEstate?.unionName === unionName &&
      realEstate?.municipality === municipality &&
      realEstate?.matrNumber === matrNumber &&
      realEstateNumber &&
      realEstate?.realEstateNumber.every((x) =>
        realEstateNumber.includes(x)
      ) &&
      realEstateNumber.every((x) =>
        realEstate?.realEstateNumber.includes(x)
      ) &&
      (realEstate?.buildDate
        ? buildYear !== new Date(realEstate?.buildDate).getFullYear()
        : buildYear !== 0) &&
      realEstate?.totalArea === totalArea &&
      realEstate?.buildingArea === buildingArea &&
      realEstate?.commercialArea === commercialArea &&
      realEstate?.residentialArea === residentialArea &&
      realEstate?.basementArea === basementArea &&
      realEstate?.floorCount === floorCount &&
      (realEstate?.addonDate
        ? addonYear !== new Date(realEstate?.addonDate).getFullYear()
        : addonYear !== 0)
    );
  }, [
    unionName,
    municipality,
    matrNumber,
    realEstateNumber,
    buildYear,
    totalArea,
    buildingArea,
    commercialArea,
    residentialArea,
    basementArea,
    floorCount,
    addonYear,
  ]);

  // Functions

  const editHandler = async () => {
    await updateRealEstate.mutateAsync({
      realEstateId: String(realEstate?._id),
      dto: {
        unionName: unionName,
        municipality: municipality,
        matrNumber: matrNumber,
        realEstateNumber: realEstateNumber,
        buildDate: new Date(`${leftPad(buildYear.toString(), 4, '0')}-01-01T12:00:00.000Z`).toUTCString(),
        totalArea: totalArea,
        buildingArea: buildingArea,
        commercialArea: commercialArea,
        residentialArea: residentialArea,
        basementArea: basementArea,
        floorCount: floorCount,
        addonDate: new Date(`${leftPad(addonYear.toString(), 4, '0')}-01-01T12:00:00.000Z`).toUTCString(),
      },
    });
    toast.success('Detaljer blev redigeret.');
    closeHandler();
  };

  const closeHandler = () => {
    props.onRequestClose();
  };

  const loading = false;
  // Return
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader
        title="Rediger BBR oplysninger"
        onRequestClose={closeHandler}
      />

      {/* // Input */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <InputWithLabel
            inputProps={{
              value: unionName,
              onChange: (e) =>
                setUnionName((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'unionName',
            }}
            label={'Ejendomsnavn'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: municipality,
              onChange: (e) =>
                setMunicipality((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'municipality',
            }}
            label={'Kommune'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: matrNumber,
              onChange: (e) =>
                setMatrNumber((e.target as HTMLInputElement).value),
              type: 'text',
              name: 'matrNumber',
            }}
            label={'Matrikelnummer'}
          />
        </div>
        <div>
          <MultiInput
            label={'Ejendomsnummer'}
            type="number"
            setItems={setRealEstateNumber}
            items={realEstateNumber}
            addItem={() => setRealEstateNumber(realEstateNumber.concat(0))}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: buildYear,
              onChange: (e) =>
                setBuildYear(Number(e.target.value)),
              type: 'text',
              name: 'buildDate',
            }}
            label={'Opførselsår'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: totalArea,
              onChange: (e) =>
                setTotalArea(Number((e.target as HTMLInputElement).value)),
              type: 'text',
              name: 'totalArea',
            }}
            label={'Bygningsareal (m²)'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: buildingArea,
              onChange: (e) =>
                setBuildingArea(Number((e.target as HTMLInputElement).value)),
              type: 'text',
              name: 'buildingArea',
            }}
            label={'Bebygget areal (m²)'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: commercialArea,
              onChange: (e) =>
                setCommercialArea(Number((e.target as HTMLInputElement).value)),
              type: 'text',
              name: 'commercialArea',
            }}
            label={'Erhvervsareal (m²)'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: residentialArea,
              onChange: (e) =>
                setResidentialArea(
                  Number((e.target as HTMLInputElement).value)
                ),
              type: 'text',
              name: 'residentialArea',
            }}
            label={'Beboer areal (m²)'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: basementArea,
              onChange: (e) =>
                setBasementArea(Number((e.target as HTMLInputElement).value)),
              type: 'text',
              name: 'basementArea',
            }}
            label={'Kælderareal (m²)'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: floorCount,
              onChange: (e) =>
                setFloorCount(parseNumber((e.target as HTMLInputElement).value)),
              type: 'text',
              name: 'floorCount',
            }}
            label={'Antal etager'}
          />
        </div>
        <div>
          <InputWithLabel
            inputProps={{
              value: addonYear,
              onChange: (e) =>
                setAddonYear(parseNumber(e.target.value))
              ,
              type: 'text',
              name: 'addonDate',
            }}
            label={'Om-/ tilbygningår'}
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
        confirmHandler={editHandler}
        disabled={disableButton}
      />
    </Modal>
  );
};

export default UpdateBbrModal;
