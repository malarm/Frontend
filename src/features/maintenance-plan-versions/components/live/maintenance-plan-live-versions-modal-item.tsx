// 3rd party libraries
import React from 'react';

// Workspace libraries
import { BigRadio } from '@project/ui/radio/big-radio'



export type ILiveVersionModalItemProps = {
  onClick: () => void;
  checked: boolean;
  name: string;
  description: string;
  isLive: boolean;
  isLoaded: boolean;
};

/**
 * Render a selectable role (used in the "Invite user to organization" modal)
 */
export const LiveVersionModalItem: React.FC<ILiveVersionModalItemProps> = (
  props
) => {
  const { isLive, isLoaded, name, description, ...bigRadioProps } = props;

  return (
    <BigRadio className="mb-2" {...bigRadioProps}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-black">{name}</p>
          <p className="text-neutral-500 text-sm">{description}</p>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex">
            {/* The Active */}
            {isLoaded ? (
              <div className="rounded bg-mortar py-1 px-2 font-bold h-fit w-[55px]">
                <p className="text-xs text-black text-center">Du ser</p>
              </div>
            ) : (
              <div />
            )}
            {isLoaded && isLive && <div className="mr-2" />}
            {/* Live */}
            {isLive ? (
              <div className="rounded bg-mint py-1 px-2 font-bold h-fit w-[55px]">
                <p className="text-xs text-black text-center">Aktuel</p>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </BigRadio>
  );
};
