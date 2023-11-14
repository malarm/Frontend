// 3rd party libraries
import React, { Dispatch, SetStateAction, useState } from 'react';

// Workspace libraries
import { getErrorMessage } from '@project/ui/get-error-message';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import toast from '@thor-frontend/common/utils/toast';
import { useMaintenancePlanVersionId } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-maintenance-plan-version-id';
import { InactiveCardItem } from '@thor-frontend/features/real-estate-cards/modals/inactive-card-item';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { useInactiveCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/inactive-cards-by-maintenance-plan-version';
import { useUpdateRealEstateCard } from '@thor-frontend/features/real-estate-cards/queries/update-real-estate-card';



export type IInactiveCardsModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

/**
 * Component description
 */
export const InactiveCardsModal: React.FC<IInactiveCardsModalProps> = (
  props
) => {
  // state
  const [selected, setSelected] = useState<string[]>([]);
  const planId = useMaintenancePlanVersionId();
  const cardsQuery = useInactiveCardsByMaintenancePlanVersion(planId);
  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);
  const updateCardQuery = useUpdateRealEstateCard();
  const cards = cardsQuery.data;

  const isLoading =
    getBDKbyVersion.isFetching ||
    cardsQuery.isFetching ||
    updateCardQuery.status === 'loading';

  // handlers
  const addToSelected = (id: string) =>
    setSelected((previous) => previous.concat([id]));

  const removeFromSelected = (id: string) =>
    setSelected((previous) => previous.filter((x) => x !== id));

  const setIsActive = (id: string) => (value: boolean) => {
    if (value === false) {
      removeFromSelected(id);
    } else {
      addToSelected(id);
    }
  };

  const submit = async () => {
    try {
      await Promise.all(
        selected.map((realEstateCardId) =>
          updateCardQuery.mutateAsync({
            realEstateCardId,
            body: {
              isActivated: true,
            },
          })
        )
      );

      getBDKbyVersion.refetch();
      toast.success('De valgte kort er aktiveret!');
      setSelected([]);
      props.setIsOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const cancel = () => {
    setSelected([]);
    props.setIsOpen(false);
  };

  const cardsContent = () => {
    if (cards.length === 0) {
      return (
        <p className="text-base text-neutral-500 italic">
          Alle standard bygningsdelskort er i brug
        </p>
      );
    }

    return cards.map((card) => (
      <InactiveCardItem
        isSelected={selected.includes(card._id)}
        item={card}
        setIsSelected={setIsActive(card._id)}
      />
    ));
  };

  // render
  return (
    <Modal {...props}>
      <ModalHeader
        title="Tilføj bygningsdelskort"
        onRequestClose={() => props.setIsOpen(false)}
      />

      <p>Vælg et eller flere bygningsdelskort for at tilføje dem.</p>

      {/* standard section */}
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500 font-medium">Standard</p>
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="w-full grid place-content-center">
              <UpsiteLogoLoader />
            </div>
          ) : (
            cardsContent()
          )}
        </div>
      </div>

      {/* buttons */}

      <ModalTwoButtons
        cancelBtnText="Annuller"
        onRequestClose={cancel}
        cancelColor="cancel"
        cancelTextColor="text-neutral-700 "
        btnText={`Tilføj (${selected.length})`}
        disabled={selected.length === 0}
        loading={isLoading}
        confirmHandler={submit}
      />
    </Modal>
  );
};
