// 3rd party libraries
import { useMutation, useQuery } from '@tanstack/react-query';

// Workspace libraries
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type';
import apiClient from '@thor-frontend/common/api-client';



const getMaintenancePlanVersionById = (maintenancePlanVersionId: string) =>
  apiClient.get<MaintenancePlanVersionJSON>(
    `/maintenance-plan-versions/${maintenancePlanVersionId}`
  );

// Uncomment the code below to revert to test data
// const getMaintenancePlanVersionById = (userId: string) => Promise.resolve({ data: realEstateTestData() })

export const useMaintenancePlanVersionByIdAsync = () => {
  return useMutation({
    mutationFn: (maintenancePlanId: string) =>
      getMaintenancePlanVersionById(maintenancePlanId).then((x) => {
        return x.data;
      }),
  });
};

const key = (maintenancePlanVersionId: string) => [
  'maintenance-plan-versions-by-id',
  maintenancePlanVersionId
]

export const useMaintenancePlanVersionById = (
  maintenancePlanVersionId: string
) => {
  return useQuery(
    key(maintenancePlanVersionId),
    () =>
      getMaintenancePlanVersionById(maintenancePlanVersionId).then(
        (x) => x.data
      ),
    {
      enabled: !!maintenancePlanVersionId,
      placeholderData: null,
    }
  );
};

useMaintenancePlanVersionById.key = key
