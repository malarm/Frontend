// 3rd party libraries
import { useMemo } from 'react';

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { IMenuItem } from '@thor-frontend/features/sidebar/sidebar.interface';



export const useMenuItems = () => {
  const MENU_ITEMS: IMenuItem[] = useMemo(
    () => [
      {
        url: ThorPaths.EJENDOMME,
        icon: 'ri-building-line',
        name: 'Ejendomme',
      },
      {
        url: ThorPaths.OPGAVESTYRING,
        icon: 'ri-list-check-3',
        name: 'Opgavestyring',
        isDisabled: true,
        disabledTooltip: 'Kommer snart',
      },
      {
        url: ThorPaths.ØKONOMI,
        icon: 'ri-bar-chart-box-line',
        name: 'Økonomi',
        isDisabled: true,
        disabledTooltip: 'Kommer snart',
      },
      {
        url: ThorPaths.SETTINGS,
        icon: 'ri-settings-2-line',
        name: 'Indstillinger',
      },
    ],
    []
  );

  return MENU_ITEMS;
};
