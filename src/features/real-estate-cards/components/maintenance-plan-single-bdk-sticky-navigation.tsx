// 3rd party libraries
import React from 'react';

// Workspace libraries
import MaintenancePlanSingleBDKNavItem from '@thor-frontend/features/real-estate-cards/components/maintenance-plan-single-bdk-sticky-nav-item';



export interface IStickyNavMenuItem {
  name: string;
  id: string;
}

export const MENU_ITEMS: IStickyNavMenuItem[] = [
  {
    name: '1. Tilstand',
    id: 'tilstand',
  },
  {
    name: '2. Beskrivelse',
    id: 'beskrivelse',
  },
  {
    name: '3. Vedligehold',
    id: 'vedligehold',
  },
  {
    name: '4. Budgetposter',
    id: 'budget_poster',
  },
  {
    name: '5. Billeder',
    id: 'billeder',
  },
  {
    name: '6. Dokumenter',
    id: 'dokumenter',
  },
];

export type IStickyNavigationProps = {
  handleClick: (id: string) => void;
};

/**
 * Component description
 */
export const StickyNavigation: React.FC<IStickyNavigationProps> = (props) => {
  return (
    <div className="fixed top-[105px]">
      <div className="">
        {MENU_ITEMS.map((x, i) => {
          return (
            <MaintenancePlanSingleBDKNavItem
              handleClick={props.handleClick}
              item={x}
              key={`sticky-nav-item-${i}`}
            />
          );
        })}
      </div>
    </div>
  );
};
