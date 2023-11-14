// 3rd party libraries
import React, { useId } from 'react';

// Workspace libraries
import { SmallSpinnerV2 } from '@project/ui';
import { useUpdateRealEstateCard } from '@thor-frontend/features/real-estate-cards/queries/update-real-estate-card';
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection';
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image';
import { getCDNUrl } from '@thor-frontend/common/utils';
import { getConditionText, renderConditionIcon, } from '@thor-frontend/features/maintenance-plan-versions/components/contition-bdk-list';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { TooltipBox } from '@project/ui';



export type IMaintenancePlanLiveBDKListProps = {
  //
  item: RealEstateCardSummaryJSON;
  openBDKDetail: (item: RealEstateCardSummaryJSON) => void;
};

/**
 * Component description
 */
export const MaintenancePlanLiveBDKList: React.FC<
  IMaintenancePlanLiveBDKListProps
> = (props) => {
  // Hooks
  const realEstateCardQuery = useUpdateRealEstateCard();

  const isLoading = realEstateCardQuery.isLoading;
  const id = useId();

  return (
    <div className="border-t border-slate">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <UpsiteLogoLoader />
        </div>
      ) : (
        <div
          className="hover:bg-neutral-100 cursor-pointer p-4 flex justify-between"
          onClick={() => props.openBDKDetail(props.item)}
        >
          <div className="w-12 mt-1.5">
            <span
              data-tooltip-id={id}
              data-tooltip-content={getConditionText(props.item.operationInformation.condition)}
              className='inline-block'
            >
              {renderConditionIcon(props.item.operationInformation.condition)}
            </span>
            <TooltipBox id={id} place="bottom" />
          </div>
          <div className="w-1/2">
            <p className="text-black text-base font-medium mt-1.5">
              {props.item.number.toString().padStart(2, '0')} {props.item.name}
            </p>
          </div>

          <div className="flex-1">
            <p className="text-neutral-500 text-base mt-1.5">
              {props.item.firstActivityYear ?? '-'}
            </p>
          </div>
          <div className="w-12 text-right">
            <i className="ri-add-line text-neutral-500 text-[24px] mt-1.5 "></i>
          </div>
        </div>
      )}
    </div>
  );
};
