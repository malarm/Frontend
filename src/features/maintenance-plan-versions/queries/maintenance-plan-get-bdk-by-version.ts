import { useQuery } from '@tanstack/react-query';
import apiClient from '@thor-frontend/common/api-client';

const getMaintenancePlanBDKbyVersionId = (versionId: string) =>
  apiClient.get(`/real-estate-cards/by-maintenance-plan-version/${versionId}`);

export const useMaintenancePlanBDKbyVersionId = (versionId: string) => {
  return useQuery(
    ['maintenance-plan-bdk-by-version-id'],
    () => getMaintenancePlanBDKbyVersionId(versionId).then((x) => x.data),
    {
      enabled: !!versionId,
      placeholderData: [],
    }
  );
};
