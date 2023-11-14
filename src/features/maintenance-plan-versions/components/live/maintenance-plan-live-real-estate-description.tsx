// 3rd party libraries
import React, { useEffect, useRef } from 'react';

// Workspace libraries
import { usePathParam, usePathParamV2 } from '@project/ui';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';



export type IMaintenancePlanLiveRealEstateDescriptionProps = {
  //
};

/**
 * Component description
 */
export const MaintenancePlanLiveRealEstateDescription: React.FC<
  IMaintenancePlanLiveRealEstateDescriptionProps
> = (props) => {
  const [planId] = usePathParamV2('planId');
  const planVersion = useMaintenancePlanVersionById(planId);
  const aRef = useRef();
  useEffect(() => {
    const element = aRef.current as HTMLDivElement;
    const content =
      '<p class="text-neutral-500 italic">Der er endnu ikke oprettet nogen konklusion</p>';

    if (aRef && aRef.current)
      element.innerHTML =
        planVersion?.data?.realEstateDescription === null ||
          planVersion?.data?.realEstateDescription?.trim() === ''
          ? content
          : planVersion?.data?.realEstateDescription;
  }, [aRef, planVersion?.data?.realEstateDescription]);

  return (
    <div>
      <h1 className="text-2xl text-black mb-2">Ejendomsbeskrivelse</h1>
      <div className='ql-editor' ref={aRef}></div>
    </div>
  );
};
