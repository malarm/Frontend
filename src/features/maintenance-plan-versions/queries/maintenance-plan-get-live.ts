// 3rd party libraries
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type';
import apiClient from '@thor-frontend/common/api-client';



export const getLiveMaintenancePlan = (realEstateId: string) =>
  apiClient.get<MaintenancePlanVersionJSON>(
    `/maintenance-plan-versions/by-real-estate/${realEstateId}/live`
  );

const key = (realEstateId: string) => ['live-maintenance-plan', realEstateId]

export const useLiveMaintenancePlan = (realEstateId: string) => {
  return useQuery(
    key(realEstateId),
    () => getLiveMaintenancePlan(realEstateId).then((x) => x.data),
    {
      enabled: !!realEstateId,
      placeholderData: null,
    }
  );
};

useLiveMaintenancePlan.key = key