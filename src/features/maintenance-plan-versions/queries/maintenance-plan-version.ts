// 3rd party libraries
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { MaintenancePlanVersionSummaryJSON } from '@project/shared/feature-maintenance-plan-versions/projections/maintenance-plan-version-summary.projection'
import { PaginationResult } from '@project/shared/common/types/pagination-result.type';
import apiClient from '@thor-frontend/common/api-client';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';



const getMaintenancePlanVersions = (realEstateId: string) =>
  apiClient.get<PaginationResult<MaintenancePlanVersionSummaryJSON>>(`/maintenance-plan-versions/by-real-estate/${realEstateId}`);

// Uncomment the code below to revert to test data
// const getMaintenancePlanVersions = (userId: string) => Promise.resolve({ data: realEstateTestData() })

const key = (realEstateId: string) => ['maintenance-plan-versions', realEstateId]

export const useMaintenancePlanVersions = (realEstateId: string) => {

  const client = useQueryClient()

  return useQuery(
    key(realEstateId),
    () => getMaintenancePlanVersions(realEstateId).then((x) => {

      if (x.data.hasMore === false && x.data.items.length === 1) {
        client.invalidateQueries(useEditableMaintenancePlan.key('').slice(0, 1))
      }

      return x.data
    }),
    {
      enabled: !!realEstateId,
      placeholderData: {
        items: [],
        hasMore: false
      },
    }
  );
};

useMaintenancePlanVersions.key = key