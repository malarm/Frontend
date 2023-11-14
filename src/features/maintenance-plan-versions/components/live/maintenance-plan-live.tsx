// 3rd party libraries
import React from 'react';

// Workspace libraries
import MaintenancePlanLiveBDK from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-bdk'
import { MaintenancePlanLiveBudget } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-budget';
import { MaintenancePlanLiveConclusion } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-conclusion';
import { MaintenancePlanLiveNavigation } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-navigation';
import { MaintenancePlanLiveRealEstateDescription } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-real-estate-description';
import { MaintenancPlanLiveSection } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-section';
import MaintenancePlanLiveUpdateModal from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-update-modal';
import MaintenancePlanLiveVersionsModal from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-versions-modal';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import { useMLNSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-maintenance-plan-live-section-observer';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';



export type IMaintenancePlanLiveProps = {
  //
};

/**
 * Component description
 */

export const MaintenancePlanLive: React.FC<IMaintenancePlanLiveProps> = (
  props
) => {
  // State
  const [showVersionsModal, setShowVersionsModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);

  const MenuItems = [
    'Ejendomsbeskrivelse',
    'Bygningsdelskort',
    'Budget',
    'Konklusion',
  ];

  const refs = MenuItems.reduce((refsObj, menuItem) => {
    refsObj[menuItem] = React.createRef<HTMLDivElement>();
    return refsObj;
  }, {});

  const handleStickyNavClick = (id: string) => {
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  MenuItems.forEach((menu) => useMLNSectionObserver(menu, refs[menu]));

  const scrollDivClass = 'scroll-mt-[200px]';

  return (
    <>
      {/* Modals */}
      <MaintenancePlanLiveVersionsModal
        isOpen={showVersionsModal}
        onRequestClose={() => setShowVersionsModal(false)}
        confirmHandler={() => alert('ja')}
      />
      {/* Modals */}
      <MaintenancePlanLiveUpdateModal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        confirmHandler={() => alert('ja')}
      />
      <RealEstateSubPage title="Vedligeholdelsesplan">
        {/* Navigation */}
        <MaintenancePlanLiveNavigation
          setShowVersionsModal={setShowVersionsModal}
          setShowUpdateModal={setShowUpdateModal}
          menuItems={MenuItems}
          handleClick={handleStickyNavClick}
        />
        {/* Content */}
        <MaintenancePlanContentWrapper className="flex flex-col gap-8">
          <MaintenancPlanLiveSection>
            <div
              id={MenuItems[0]}
              className={scrollDivClass}
              ref={refs[MenuItems[0]]}
            ></div>
            <MaintenancePlanLiveRealEstateDescription />
          </MaintenancPlanLiveSection>

          <MaintenancPlanLiveSection>
            <div
              id={MenuItems[1]}
              className={scrollDivClass}
              ref={refs[MenuItems[1]]}
            ></div>
            <MaintenancePlanLiveBDK />
          </MaintenancPlanLiveSection>

          <MaintenancPlanLiveSection>
            <div
              id={MenuItems[2]}
              className={scrollDivClass}
              ref={refs[MenuItems[2]]}
            ></div>
            <MaintenancePlanLiveBudget />
          </MaintenancPlanLiveSection>

          <MaintenancPlanLiveSection>
            <div
              id={MenuItems[3]}
              className={scrollDivClass}
              ref={refs[MenuItems[3]]}
            ></div>
            <MaintenancePlanLiveConclusion />
          </MaintenancPlanLiveSection>
        </MaintenancePlanContentWrapper>
      </RealEstateSubPage>
    </>
  );
};
