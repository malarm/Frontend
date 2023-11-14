// 3rd party libraries
import { useState } from 'react';

// Workspace libraries
import { usePathParam, usePathParamV2 } from '@project/ui';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import { MaintenancePlanLiveBDKList } from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-live-bdk-list';
import { BDKDetail } from '@thor-frontend/features/maintenance-plan-versions/components/live/bdk-detail/bdk-detail';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';



const MaintenancePlanLiveBDK = () => {
  // Hooks
  const [planId] = usePathParamV2('planId');

  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);

  const [realEstateCardId] = usePathParamV2('bdkId');
  const realEstateCardById = useRealEstateCardById(realEstateCardId);
  const { data } = realEstateCardById;

  // Sort BDK
  const bdk = [...getBDKbyVersion.data].sort((a, b) => {
    return a.number - b.number;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<RealEstateCardSummaryJSON | undefined>();

  const CloseBDKDetail = () => {
    setIsOpen(false);
  };

  const openBDKDetail = (bdkData: RealEstateCardSummaryJSON) => {
    setItem(bdkData);
    setIsOpen(true);
  };

  return (
    <>
      <h1 className="text-2xl text-black mb-2">Bygningsdelskort</h1>
      <BDKDetail isOpen={isOpen} closeSideView={CloseBDKDetail} item={item} />
      {/* Content */}
      <div>
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
        <div className="">
          {bdk.map((x, i) => (
            <MaintenancePlanLiveBDKList
              key={`${i}-bdk-list-item`}
              openBDKDetail={openBDKDetail}
              item={x}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MaintenancePlanLiveBDK;
