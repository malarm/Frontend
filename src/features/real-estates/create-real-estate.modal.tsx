// 3rd party libraries
import React from 'react';
import ReactModal from 'react-modal';
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { AutocompleteItemType } from '@project/shared/feature-dawa/eunms/autocomplete-item-type.enum'
import { DawaAutocompleteItem } from '@project/shared/feature-dawa/types/dawa-autocomplete-item.type'
import { TIME_UNITS } from '@project/shared/common/constants/time-units.constant';
import { searchDawa } from '@thor-frontend/common/services/dawa/autocomplete';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { Infobox } from '@thor-frontend/common/infobox/infobox';

// Application
import { InputWithLabel } from '../../common/input-with-label/input-with-label';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: (addressId: string) => void;
  errorMessage: string;
  loading?: boolean;
  confirmIsDisabled?: boolean;
}

const RealEstateCreateModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  const inputRef = React.createRef<HTMLInputElement | null>();

  // State

  const [phrase, setPhrase] = React.useState('');
  const [debouncedPhrase, _setDebouncedPhrase] = React.useState('');
  const [currentAddress, setCurrentAddress] = React.useState<
    DawaAutocompleteItem & { type: (typeof AutocompleteItemType)['Address'] }
  >(null);

  //Hooks
  const setDebouncedPhrase = useDebouncedFunction(250, (value: string) =>
    _setDebouncedPhrase(value)
  );

  const searchIsEnabled = phrase.length > 2;

  const autcompleteItemsQuery = useQuery(
    ['dawa-autocomplete-items', debouncedPhrase],
    () => searchDawa(debouncedPhrase).then((x) => x.data),
    {
      enabled: debouncedPhrase.length > 2,
      placeholderData: [],
      cacheTime: TIME_UNITS.SECOND * 5,
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (currentAddress && phrase !== currentAddress.tekst) {
      setCurrentAddress(null);
    }
  }, [currentAddress, phrase]);

  React.useEffect(() => {
    const options = autcompleteItemsQuery.data;

    const inputIsFocused =
      inputRef.current && inputRef.current === document.activeElement;

    if (
      !inputIsFocused &&
      options.length === 1 &&
      options[0].type === 'adresse' &&
      phrase.length > 0
    ) {
      setCurrentAddress(options[0]);
      setPhrase(options[0].forslagstekst);
      _setDebouncedPhrase(options[0].forslagstekst);
    }
  }, [autcompleteItemsQuery.data, inputRef, phrase.length]);

  const onClick = React.useCallback((item: DawaAutocompleteItem) => {
    setPhrase(item.tekst);
    _setDebouncedPhrase(item.tekst);

    if (item.type === 'adresse') {
      setCurrentAddress(item);
    }
  }, []);

  // render functions
  const renderResults = () => {
    if (
      !searchIsEnabled ||
      autcompleteItemsQuery.data.length === 0 ||
      currentAddress !== null
    )
      return '';

    return (
      <div className="bg-white shadow left-[40px] top-[215px] w-96 rounded-md absolute z-50 border-gray-200 border max-h-60 overflow-y-scroll">
        {autcompleteItemsQuery.data.map((item, index) => (
          <div
            key={`dawa-search-item-${index}`}
            onClick={() => onClick(item)}
            className="hover:bg-gray-100 cursor-pointer px-3 py-4 border-b border-gray-200"
          >
            {item.forslagstekst}
          </div>
        ))}
      </div>
    );
  };

  const closeHandler = () => {
    setPhrase('');
    props.onRequestClose();
  };

  const disabledConfirmBtn = phrase.length <= 0;
  // Return
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader title="Tilføj ejendom" onRequestClose={closeHandler} />

      <p className="text-black mb-7 text-base mt-2">
        Indtast en adresse og vælg den rette fra listen af forslag.{' '}
      </p>

      {/* // Input */}
      <InputWithLabel
        inputProps={{
          placeholder: 'Lersø Parkallé 40, 2100 København Ø',
          value: phrase,
          ref: inputRef,
          onInput: (e) => {
            const value = e.currentTarget.value;
            setPhrase(value);
            setDebouncedPhrase(value);
          },
        }}
        label={'Adresse'}
      />

      {props.errorMessage && (
        <Infobox className="mt-4">
          <p className="text-sm">{props.errorMessage}</p>
        </Infobox>
      )}
      {renderResults()}
      <ModalTwoButtons
        loading={props.loading}
        cancelBtnText="Annuller"
        onRequestClose={closeHandler}
        cancelColor="secondary"
        cancelTextColor="text-neutral-700"
        btnText="Tilføj ejendom"
        btnColor="neutral"
        disabled={disabledConfirmBtn || props.confirmIsDisabled}
        confirmHandler={() => {
          props.confirmHandler(currentAddress?.data?.id);
        }}
      />
    </Modal>
  );
};

RealEstateCreateModal.defaultProps = {
  loading: false,
};

export default RealEstateCreateModal;
