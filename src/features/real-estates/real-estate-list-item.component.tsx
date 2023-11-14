// 3rd party libraries
import classNames from 'classnames';
import React, { useId, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { IRealEstateSummary } from '@project/shared/feature-real-estates/projections/real-estate-summary.projection'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type'
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { DropdownMenuV2, TooltipBox } from '@project/ui';
import { getEnergyLabelIcon } from '@thor-frontend/features/real-estates/utils/get-energy-label-icon.util';

// Application
import { EnergyNotFound } from '../../assets/svg';
import { StaticMap } from '@thor-frontend/common/static-map/static-map';



type Props = {
  index: number;
  item: ParsedJson<IRealEstateSummary>;
  onSharedWithClicked: () => void;
};

const RealEstateListItem = (props: Props) => {
  const history = useHistory();

  const tooltipId = useId();

  const addressUsed = props.item
    ? (props.item.addressString ?? props.item.unionName ?? `${props.item.zipcode} ${props.item.municipality}`)
    : ''

  interface EnergyLabelProps {
    value: string | null | undefined;
  }

  const EnergyLabel: React.FC<EnergyLabelProps> = (props) => {
    const { value } = props;
    if (value) {
      return (
        <div className="flex">
          {value.split('/').map((cl) => {
            const Icon = getEnergyLabelIcon(cl);

            return (
              <div key={`${cl}-${Math.random()}`} className="mr-2">
                <Icon />
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <span
        data-tooltip-id={`label-${tooltipId}`}
        data-tooltip-content={'Energimærke ikke fundet'}
        className="inline-block"
      >
        <EnergyNotFound />
        <TooltipBox id={`label-${tooltipId}`} place="bottom" />
      </span>
    );
  };

  const renderSharedWith = () => {
    if (props.item.relationType === 'external') {
      // "delt med mig"
      return <p className="text-neutral-500 text-sm">Delt med mig</p>;
    }

    // "delt med x"
    return (
      <div
        className="rounded-lg py-1 px-2 bg-black/5 flex flex-row gap-1 w-max items-center hover:bg-black/10"
        onClick={(e) => {
          e.stopPropagation();
          props.onSharedWithClicked();
        }}
      >
        <i className="ri-share-line text-base leading-none text-black"></i>
        <p className="text-xs text-black font-medium">
          {props.item.numberOfExternalOrganizations ?? 0}
        </p>
      </div>
    );
  };

  return (
    <>
      <div
        data-tooltip-id={tooltipId}
        data-tooltip-content={'Kontakt os for at få adgang til denne ejendom'}
        onClick={() => {
          if (props.item.isLocked) {
            return;
          }

          history.push(`${ThorPaths.EJENDOMME}/${props.item._id}/overblik`);
        }}
        className={classNames(
          'flex border border-neutral-200 rounded-xl mb-2 shadow-sm bg-white items-center relative py-4 px-4 hover:bg-neutral-100 cursor-pointer',
          props.item.isLocked ? 'opacity-50' : ''
        )}
      >
        <div className="w-6/12 flex items-center">
          <div className="w-[50px] h-[50px]  relative">
            <StaticMap
              address={addressUsed}
              imageProps={{
                className: 'absolute inset-0 rounded-xl',
                imgClassName: 'object-cover absolute inset-0 rounded-xl'
              }}
              mapOptions={{
                size: '50x85',
                zoom: 15
              }}
            />
          </div>
          <div className='ml-4'>
            <p className="text-black font-medium text-base ">
              {props.item.unionName}
            </p>
            <p className='text-sm text-neutral-500'>
              {props.item.zipcode} {props.item.municipality}
            </p>
          </div>
        </div>
        <p className="text-neutral-500 text-sm w-2/12">
          kr. {props.item.yearlyExpensesOverArea ?? 0}
        </p>
        <div className=" w-2/12">
          <EnergyLabel value={props.item.energyLabelClassification} />
        </div>
        <p className="text-neutral-500 text-xs w-2/12 ">{renderSharedWith()}</p>
        <div
          className="w-2/12 relative text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuV2
            className="block !h-full !w-full"
            showRemixIcon
            align="right"
            cardClassNames="absolute"
            items={[
              {
                title: 'Deling',
                className: 'text-black',
                action: () => props.onSharedWithClicked(),
              },
              {
                title: 'Fjern',
                className: 'text-rose-500',
                action: () => console.log('test'),
              },
            ]}
          />
        </div>
      </div>
      {props.item.isLocked ? <TooltipBox id={tooltipId} /> : ''}
    </>
  );
};

export default RealEstateListItem;
