// 3rd party libraries
import classNames from 'classnames';
import React from 'react';

// Workspace libraries
import { useActiveBDKSectionStore } from '@thor-frontend/features/maintenance-plan-versions/store/active_bdk_section.store';
import { IStickyNavMenuItem } from '@thor-frontend/features/real-estate-cards/components/maintenance-plan-single-bdk-sticky-navigation';



type Props = {
  item: IStickyNavMenuItem;
  handleClick: (id: string) => void;
};

const MaintenancePlanSingleBDKNavItem = (props: Props) => {
  // State
  const [hover, setHover] = React.useState(false);
  const useActiveBDKSection = useActiveBDKSectionStore();

  // console.log(useActiveBDKSection.bdkSection);

  const active =
    useActiveBDKSection.activeSections.includes(props.item.id) || hover;

  return (
    <div
      onClick={() => props.handleClick(props.item.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer flex"
    >
      <div
        className={classNames('transition-width bg-black h-0.5 mt-2.5', {
          'w-2 mr-2': active,
          'w-0 mr-0.5': !active,
        })}
      />
      <p
        className={classNames('text-base font-medium mb-4 transition', {
          'text-neutral-500': !active,
          'text-black': active,
        })}
      >
        {props.item.name}
      </p>
    </div>
  );
};

export default MaintenancePlanSingleBDKNavItem;
