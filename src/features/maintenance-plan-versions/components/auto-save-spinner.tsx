// 3rd party libraries
import classNames from 'classnames';
import { formatDistance } from 'date-fns';
import { da } from 'date-fns/locale';
import React, { useId, useRef } from 'react';

// Workspace libraries
import { SmallSpinnerV2 } from '@project/ui';
import { TooltipBox } from '@project/ui';
import { useSaveDateStore } from '@thor-frontend/features/maintenance-plan-versions/store/savedate.store';



type Props = {
  loading: boolean;
};

const AutoSaveSpinner = (props: Props) => {

  const id = useId();
  // Hooks
  const firstRender = useRef(true);
  // Store Hooks
  const saveDate = useSaveDateStore();

  // Use Effect
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!props.loading) {
      saveDate.setDate(new Date());
    }
  }, [props.loading]);

  return (
    <div className="flex">
      <div className="flex flex-row gap-2 items-center"
        data-tooltip-id={id}
        data-tooltip-content={`Sidst gemt ${formatDistance(
          saveDate.date ?? new Date(),
          new Date(),
          { addSuffix: true, locale: da }
        )}`}
      >
        <div className="w-6 h-6 grid place-content-center">
          {props.loading ? (
            <SmallSpinnerV2 />
          ) : (
            <i className="ri-checkbox-circle-line text-[20px] text-green" />
          )}
        </div>

        <p
          className={classNames(
            'text-sm text-neutral-500 transition-opacity duration-100',
            { 'opacity-0': props.loading }
          )}
        >
          Alle ændringer er gemt
        </p>
      </div>
      {
        !!saveDate.date && <TooltipBox id={id} place="bottom" />
      }

    </div>
  );
};

AutoSaveSpinner.defaultProps = {
  loading: false,
};

export default AutoSaveSpinner;
