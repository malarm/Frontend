// 3rd party libraries
import React, { forwardRef, RefObject } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';

// Workspace libraries
import { useBDKSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer';
import { useActiveBDKSectionStore } from '@thor-frontend/features/maintenance-plan-versions/store/active_bdk_section.store';
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type';
import { usePathParamV2 } from '@project/ui/hooks/use-path-param-v2';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useUpdateRealEstateCard } from '@thor-frontend/features/real-estate-cards/queries/update-real-estate-card';
import { CondititonItem } from '@thor-frontend/features/real-estate-cards/components/condition-item';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { Condition1, Condition2, Condition3, Condition4, } from '@thor-frontend/assets/svg';




/**
 * The "Tilstand" section of the real estate card details view
 */
export const Condition = () => {

  const updateRealEstateCard = useUpdateRealEstateCard();

  const [realEstateCardId] = usePathParamV2('bdkId');
  const [planId] = usePathParamV2('planId');

  const realEstateCardById = useRealEstateCardById(realEstateCardId);
  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);

  const getConditionText = (value: number): string => {
    switch (value) {
      case 0:
        return 'Meget god';

      case 1:
        return 'Acceptabel';

      case 2:
        return 'Mindre god';

      case 3:
        return 'Kritisk';

      default:
        return '';
    }
  };

  const value = getConditionText(
    realEstateCardById.data?.operationInformation?.condition
  );

  const client = useQueryClient();

  const updateCondition = async (value: number) => {
    // optimistic (local) update
    client.setQueryData<RealEstateCardJSON>(
      useRealEstateCardById.key(realEstateCardId),
      (old) => ({
        ...old,
        operationInformation: {
          ...old.operationInformation,
          condition: value,
        },
      })
    );

    await updateRealEstateCard.mutateAsync({
      realEstateCardId: realEstateCardId,
      body: {
        operationInformation: {
          condition: value,
        },
      },
    });

    await getBDKbyVersion.refetch();
  };

  return (
    <div>
      <h2 className="text-xl text-black mb-6 mt-8">1. Tilstand</h2>
      <div className="flex flex-row gap-2 bg-white rounded-xl p-2">
        {/* Very good */}
        <CondititonItem
          svgIcon={Condition1}
          conditionName={'Meget god'}
          onClick={() => updateCondition(0)}
          checked={value === 'Meget god'}
          colorClassName="bg-green-100"
          className="w-1/4 group"
        />

        {/* Acceptable */}
        <CondititonItem
          svgIcon={Condition2}
          conditionName={'Acceptabel'}
          onClick={() => updateCondition(1)}
          checked={value === 'Acceptabel'}
          colorClassName="bg-amber-100"
          className="w-1/4 group"
        />

        {/* Less good */}
        <CondititonItem
          svgIcon={Condition3}
          conditionName={'Mindre god'}
          onClick={() => updateCondition(2)}
          checked={value === 'Mindre god'}
          colorClassName="bg-orange-100"
          className="w-1/4 group"
        />

        {/* Critical */}
        <CondititonItem
          svgIcon={Condition4}
          conditionName={'Kritisk'}
          onClick={() => updateCondition(3)}
          checked={value === 'Kritisk'}
          colorClassName="bg-rose-100"
          className="w-1/4 group"
        />
      </div>
    </div>
  );
}
