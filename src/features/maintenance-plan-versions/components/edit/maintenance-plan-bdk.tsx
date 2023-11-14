// 3rd party libraries
import { useState } from 'react';

// Workspace libraries
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import { usePathParamV2 } from '@project/ui';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import MaintenancePlanBDKlistItem from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-bdk-list-item';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import MaintenancePlanTopNavigation from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-top-navigation';
import { InactiveCardsModal } from '@thor-frontend/features/real-estate-cards/modals/inactive-cards.modal';
import EditMaintenancePlanTopBtns from '@thor-frontend/features/real-estates/components/edit-maintenance-plan-top-btns';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import MaintenancePlanHeader from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-edit-header';



const MaintenancePlanBDK = () => {
  // Hooks
  const [planId] = usePathParamV2('planId');

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);

  // Sort BDK
  const bdk = [...getBDKbyVersion.data].sort((a, b) => {
    return a.number - b.number;
  });

  return (
    <RealEstateSubPage
      title="Vedligeholdelsesplan"
      topBarChildren={
        <>
          {/* Buttons */}
          <EditMaintenancePlanTopBtns
            stepsDto={{ isCardsConfirmed: true }}
            nextBtnUrlPath={ThorSubPaths.MAINTENANCE_BUDGET}
            prevBtnUrlPath={ThorSubPaths.MAINTENANCE_DESCRIPTION}
          />
        </>
      }
    >
      {/* Content */}
      <MaintenancePlanContentWrapper>
        <MaintenancePlanHeader title="Bygningsdelskort" />
        <UpsiteButton
          onClick={() => setModalIsOpen(true)}
          type="secondary"
          className="mt-4"
        ><i className="text-xl ri-add-line" /> Tilføj bygningsdelskort</UpsiteButton>
        {/* Header */}
        <div className="flex justify-between mt-8 mb-4">
          <div className="w-12">
            <p className="text-neutral-500 text-sm font-medium ">Tilstand</p>
          </div>
          <div className="w-1/2">
            <p className="text-neutral-500 text-sm font-medium pl-4">Navn</p>
          </div>
          <div className="flex-1">
            <p className="text-neutral-500 text-sm font-medium">
              Første aktivitet
            </p>
          </div>
          <div className="w-12"></div>
        </div>
        {/* Content Items */}
        <div className="mb-12">
          {bdk.map((x, i) => (
            <MaintenancePlanBDKlistItem key={`${i}-bdk-list-item`} item={x} />
          ))}
        </div>
        {/* Modals */}
        <InactiveCardsModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
      </MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlanBDK;
