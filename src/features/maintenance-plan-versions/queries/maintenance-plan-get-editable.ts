// 3rd party libraries
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type';
import apiClient from '@thor-frontend/common/api-client';



export const getEditableMaintenancePlan = (realEstateId: string) =>
  apiClient.get<MaintenancePlanVersionJSON>(
    `/maintenance-plan-versions/by-real-estate/${realEstateId}/editable`
  );

const key = (realEstateId: string) => [
  'editable-maintenance-plan',
  realEstateId
];


export const useEditableMaintenancePlan = (realEstateId: string) => {
  return useQuery(
    key(realEstateId),
    () => getEditableMaintenancePlan(realEstateId).then((x) => x.data),
    {
      enabled: !!realEstateId,
      placeholderData: null,
    }
  );
};

useEditableMaintenancePlan.key = key;
