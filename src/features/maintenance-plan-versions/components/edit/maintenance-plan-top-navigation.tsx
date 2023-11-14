// 3rd party libraries
import classNames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import { usePathParamV2 } from '@project/ui';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { useMaintenancePlanVersionById, useMaintenancePlanVersionByIdAsync, } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';

// Application
import checkMarkAnimation from '../../../../assets/json/upsite-checkmark.json';



type Props = {
  onNameClick?: () => void;
}
const MaintenancePlanTopNavigation = (props: Props) => {
  const [maintenancePlanId] = usePathParamV2('planId');

  // url search param to know whether the animation needs to be done
  const params = new URLSearchParams(window.location.search);
  const previousCompleted = Boolean(params.get('isPreviousDone') ?? false);

  const startNavData = [
    {
      path:
        ThorSubPaths.MAINTENANCE +
        `/${maintenancePlanId}` +
        ThorSubPaths.MAINTENANCE_EDIT +
        ThorSubPaths.MAINTENANCE_DESCRIPTION,
      title: '1. Ejendomsbeskrivelse',
      isDone: false,
      isActive: true,
    },
    {
      path:
        ThorSubPaths.MAINTENANCE +
        `/${maintenancePlanId}` +
        ThorSubPaths.MAINTENANCE_EDIT +
        ThorSubPaths.MAINTENANCE_BDK,
      title: '2. Bygningsdelskort',
      isDone: false,
      isActive: false,
    },
    {
      path:
        ThorSubPaths.MAINTENANCE +
        `/${maintenancePlanId}` +
        ThorSubPaths.MAINTENANCE_EDIT +
        ThorSubPaths.MAINTENANCE_BUDGET,
      title: '3. Budget',
      isDone: false,
      isActive: false,
    },
    {
      path:
        ThorSubPaths.MAINTENANCE +
        `/${maintenancePlanId}` +
        ThorSubPaths.MAINTENANCE_EDIT +
        ThorSubPaths.MAINTENANCE_CONCLUSION,
      title: '4. Konklusion',
      isDone: false,
      isActive: false,
    },
    {
      path:
        ThorSubPaths.MAINTENANCE +
        `/${maintenancePlanId}` +
        ThorSubPaths.MAINTENANCE_EDIT +
        ThorSubPaths.MAINTENANCE_PUBLISH,
      title: '5. Udgiv',
      isDone: false,
      isActive: false,
    },
  ];
  // Hooks
  const maintenancePlanVersionById =
    useMaintenancePlanVersionById(maintenancePlanId);
  const maintenancePlanVersionByIdAsync = useMaintenancePlanVersionByIdAsync();

  const [navItems, setNavItems] = React.useState([...startNavData]);
  const [hoveredTitle, setHoveredTitle] = React.useState('');
  const [realEstateId] = usePathParamV2('id');
  const history = useHistory();

  // Functions

  const clickItemHandler = (x, urlActive, previousNavItem) => {
    if (!x.isDone && !x.isActive && previousNavItem && !previousNavItem.isDone && previousNavItem.isActive) props.onNameClick();
    if (urlActive || (!x.isDone && !x.isActive)) return;
    history.push(`${ThorPaths.EJENDOMME}/${realEstateId}${x.path}`);
  };

  // LOOP STEPS ON MOUNT
  React.useEffect(() => {
    const fetchData = async () => {
      // Paths
      const newNavItems = [...startNavData];

      const res = await maintenancePlanVersionByIdAsync.mutateAsync(
        maintenancePlanId
      );
      const steps = res.steps;

      maintenancePlanVersionById.refetch();

      if (!steps) return;

      if (steps.isDescriptionConfirmed) {
        newNavItems[0].isDone = true;
        newNavItems[0].isActive = false;
        newNavItems[1].isActive = true;
      }
      if (steps.isCardsConfirmed) {
        newNavItems[1].isDone = true;
        newNavItems[1].isActive = false;
        newNavItems[2].isActive = true;
      }
      if (steps.isBudgetConfirmed) {
        newNavItems[2].isDone = true;
        newNavItems[2].isActive = false;
        newNavItems[3].isActive = true;
      }
      if (steps.isConclusionConfirmed) {
        newNavItems[3].isDone = true;
        newNavItems[3].isActive = false;
        newNavItems[4].isActive = true;
      }

      setNavItems(newNavItems);
    };
    fetchData();
  }, [maintenancePlanVersionById.data?.steps]);
  // LOOP STEPS ON MOUNT

  // Nav Items
  const items = navItems.map((x, i) => {
    const isLast = i === navItems.length - 1;
    const isFirst = i === 0;
    const isNotLast = i !== navItems.length - 1;
    const isNotFirst = i !== 0;
    const isUrlActive =
      x.path.split('/').pop() === history.location.pathname.split('/').pop();

    let previousNavItem = undefined;
    if (!isFirst) {
      previousNavItem = navItems[i - 1];
    }

    let icon = (
      <i className="ri-checkbox-blank-circle-line text-[24px] text-neutral-200" />
    );
    if (x.isActive)
      icon = (
        <i className="ri-checkbox-blank-circle-line text-[24px] text-green" />
      );

    // addding animation 
    // when it is done && animation variable previouscompleted && not loast && 
    // when next item is not done which tells it was last complete &&
    // when land path is not done and previous one is done
    // else adding checkbox icon without animation
    if (x.isDone && previousCompleted && isNotLast && !navItems[i + 1].isDone && window.location.href.includes(navItems[i + 1].path)) {
      icon = <UpsiteLogoLoader
        className='cursor-pointer'
        heightPx={30}
        widthPx={30}
        animation={checkMarkAnimation}
        nativeColor
        loop={false}
      />;
    } else if (x.isDone)
      icon = <i className="ri-checkbox-circle-fill text-[24px] text-green" />;

    return (
      <div
        key={`${i}-maintenance-plan-item-dot`}
        className={classNames(
          `flex ${!isNotLast || !isNotFirst ? 'w-2/12' : 'flex-1'}`
        )}
      >
        {/* Lines */}
        {isNotFirst && (
          <div
            className={classNames(`h-0.5 mt-4 flex-1`, {
              'bg-green': x.isDone || x.isActive,
              'bg-neutral-200': !x.isDone && !x.isActive,
            })}
          />
        )}
        {/* Icon */}
        <div
          onClick={() => clickItemHandler(x, isUrlActive, previousNavItem)}
          onMouseEnter={() => setHoveredTitle(x.title)}
          onMouseLeave={() => setHoveredTitle('')}
          className={classNames('cursor-pointer', {
            'mr-1': !isLast,
            'ml-1': !isFirst,
            'mx-1': !isLast && !isFirst,
          })}
        >
          {icon}
        </div>
        {/* Lines */}
        {isNotLast && (
          <div
            className={classNames(`h-0.5 mt-4 flex-1`, {
              'bg-green': x.isDone,
              'bg-neutral-200': !x.isDone,
            })}
          />
        )}
      </div>
    );
  });

  // Nav Item Names
  const itemNames = navItems.map((x, i) => {
    const isLast = i === navItems.length - 1;
    const isFirst = i === 0;
    const isNotLast = i !== navItems.length - 1;
    const isNotFirst = i !== 0;
    const isUrlActive =
      x.path.split('/').pop() === history.location.pathname.split('/').pop();

    let previousNavItem = undefined;
    if (!isFirst) {
      previousNavItem = navItems[i - 1];
    }

    return (
      <div
        key={`${i}-maintenance-plan-item-name`}
        className={classNames(
          `flex ${!isNotLast || !isNotFirst ? 'w-2/12' : 'flex-1'}`,
          {
            'justify-end': isLast,
            'justify-start': isFirst,
          }
        )}
      >
        <p
          onClick={() => clickItemHandler(x, isUrlActive, previousNavItem)}
          className={classNames(`w-full cursor-pointer text-sm hover:text-black`, {
            'text-right': isLast,
            'text-left': isFirst,
            'text-center': !isFirst && !isLast,
            '!text-black': hoveredTitle === x.title,
            '!text-black font-medium': isUrlActive,
            'text-neutral-500 font-regular ': !isUrlActive,
          })}
        >
          {x.title}
        </p>
      </div>
    );
  });

  return (
    <div className="px-8 border-b border-slate">
      {/* Items */}
      <div className="flex justify-between">{items}</div>
      {/* Names */}
      <div className="flex justify-between mb-4">{itemNames}</div>
    </div>
  );
};

export default MaintenancePlanTopNavigation;
