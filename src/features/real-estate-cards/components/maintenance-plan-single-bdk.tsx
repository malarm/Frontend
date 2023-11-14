// 3rd party libraries
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

// Workspace libraries
import { usePathParamV2 } from '@project/ui';
import MaintenancePlanSingleBDKNavigation from '@thor-frontend/features/real-estate-cards/components/maintenance-plan-single-bdk-navigation';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { Condition, Description, Documents, MaintenanceDescription, Pictures, Postings, } from '@thor-frontend/features/real-estate-cards/components/details-sections';
import { MENU_ITEMS, StickyNavigation, } from '@thor-frontend/features/real-estate-cards/components/maintenance-plan-single-bdk-sticky-navigation';
import { useRealEstateCardIsLoading } from '@thor-frontend/features/real-estate-cards/stores/real-estate-card-load-state.store';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';


const MaintenancePlanSingleBDK = () => {
  // Hooks
  const [realEstateCardId] = usePathParamV2('bdkId');

  const realEstateCardById = useRealEstateCardById(realEstateCardId);

  const isLoading = useRealEstateCardIsLoading();

  const { data } = realEstateCardById;

  // Refs
  const refs = MENU_ITEMS.reduce((refsObj, menuItem) => {
    refsObj[menuItem.id] = React.createRef();
    return refsObj;
  }, {});

  // Set Active Id & Scroll to Place
  const handleStickyNavClick = (id: string) => {
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  // console.log(refs);

  const [isContentLoading, setIsContentLoading] = useState(realEstateCardById.isLoading);

  const Content = () => {

    useEffect(() => {
      setTimeout(() => setIsContentLoading(realEstateCardById.isLoading), 100);
    }, [realEstateCardById.isLoading])

    const loader = <div className="flex justify-center w-full">
      <UpsiteLogoLoader />
    </div>;

    if (realEstateCardById.isLoading)
      return loader;

    return (
      <>
        {/* Section */}
        <div className={classNames('flex w-full flex-col', (isContentLoading ? 'hidden' : ''))}>
          <Condition />
          <Description />
          <MaintenanceDescription />
          <Postings />
          <Pictures />
          <Documents
          />
        </div>
      </>
    );
  };

  return (
    <div className="bg-neutral-100">
      {/* Navigation */}
      <MaintenancePlanSingleBDKNavigation item={data} autoSaving={isLoading} />
      {/* Section Skelet */}

      <div
        className="flex px-4 max-w-full w-[1120px] mx-auto my-0 pb-[150px] pt-[35px] relative"
        style={{ gap: '60px' }}
      >
        {Content()}
      </div>
    </div>
  );
};

export default MaintenancePlanSingleBDK;
