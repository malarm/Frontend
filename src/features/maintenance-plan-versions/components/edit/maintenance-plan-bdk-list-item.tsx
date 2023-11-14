// 3rd party libraries
import React, { useId } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { DropdownMenuV2, SmallSpinnerV2, usePathParamV2, } from '@project/ui';
import { useUpdateRealEstateCard } from '@thor-frontend/features/real-estate-cards/queries/update-real-estate-card';
import toast from '@thor-frontend/common/utils/toast';
import { useConfirm } from '@project/ui/confirm';
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection';
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image';
import { getCDNUrl, getDocumentUrl } from '@thor-frontend/common/utils';
import { TooltipBox } from '@project/ui';
import { getConditionText, renderConditionIcon, } from '@thor-frontend/features/maintenance-plan-versions/components/contition-bdk-list';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { getErrorMessage } from '@project/ui/get-error-message'



type Props = {
  item: RealEstateCardSummaryJSON;
};

const MaintenancePlanBDKlistItem = (props: Props) => {

  const id = useId();
  // Hooks
  const [planId] = usePathParamV2('planId');
  const updateCardQuery = useUpdateRealEstateCard();
  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);
  const confirm = useConfirm();
  const history = useHistory();

  const isLoading = updateCardQuery.isLoading;

  const submit = async () => {
    try {
      const wasConfirmed = await confirm({
        title: 'Deaktiver bygningsdelskort',
        body: 'Bygningsdelskortet bliver fjernet fra vedligeholdelsesplanen',
        rightButtonColor: 'delete',
      });

      if (!wasConfirmed) return;

      await updateCardQuery.mutateAsync({
        realEstateCardId: props.item._id,
        body: {
          isActivated: false,
        },
      });

      toast.success('Det valgte kort er deaktiveret!');
      getBDKbyVersion.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="border-t border-slate">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <UpsiteLogoLoader />
        </div>
      ) : (
        <div className="hover:bg-neutral-100 cursor-pointer p-4 flex justify-between">
          <div
            className="w-12 mt-1.5"
            onClick={() =>
              history.push(`${history.location.pathname}/${props.item._id}`)
            }
          >
            <span
              data-tooltip-id={id}
              data-tooltip-content={getConditionText(props.item.operationInformation.condition)}
              className='inline-block'
            >
              {renderConditionIcon(props.item.operationInformation.condition)}
            </span>

            <TooltipBox id={id} place="bottom" />
          </div>
          <div
            className="w-1/2"
            onClick={() =>
              history.push(`${history.location.pathname}/${props.item._id}`)
            }
          >
            <p className="text-black text-base font-medium mt-1.5">
              {props.item.number.toString().padStart(2, '0')} {props.item.name}
            </p>
          </div>
          <div
            className="flex-1"
            onClick={() =>
              history.push(`${history.location.pathname}/${props.item._id}`)
            }
          >
            <p className="text-neutral-500 text-base mt-1.5">
              {props.item.firstActivityYear ?? '-'}
            </p>
          </div>
          <div
            className="w-12 relative text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuV2
              className="block !h-full !w-full"
              showRemixIcon
              align="right"
              cardClassNames="absolute"
              items={[
                {
                  title: 'Deaktiver',
                  className: 'text-red-500',
                  action: () => submit(),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePlanBDKlistItem;
