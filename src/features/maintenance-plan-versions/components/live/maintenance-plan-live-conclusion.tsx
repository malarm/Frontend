// 3rd party libraries
import React, { useEffect, useRef } from 'react';

// Workspace libraries
import { usePathParam, usePathParamV2 } from '@project/ui';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';



export type IMaintenancePlanLiveConclusionProps = {
  //
};

/**
 * Component description
 */
export const MaintenancePlanLiveConclusion: React.FC<
  IMaintenancePlanLiveConclusionProps
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
        planVersion?.data?.conclusion === null ||
          planVersion?.data?.conclusion?.trim() === ''
          ? content
          : planVersion?.data?.conclusion;
  }, [aRef, planVersion?.data?.conclusion]);

  return (
    <div className="pb-14">
      <h1 className="text-2xl text-black mb-2">Konklusion</h1>
      <div ref={aRef} className="text-black ql-editor"></div>
    </div>
  );
};
