// 3rd party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { IMaintenancePlanVersion } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type'
import { PublishMaintenancePlanVersionDTOJSON } from '@project/shared/feature-maintenance-plan-versions/types/dtos/publish-maintenance-plan-version.dto';
import apiClient from '@thor-frontend/common/api-client';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';



type IData = {
  maintenancePlanId: string
  dto: PublishMaintenancePlanVersionDTOJSON
}

const publishMaintenancePlan = (data: IData) =>
  apiClient.patch<IMaintenancePlanVersion>(
    `/maintenance-plan-versions/${data.maintenancePlanId}/publish`,
    data.dto
  );

export const usePublishMaintenancePlanVersion = () => {

  const client = useQueryClient()
  const realEstateId = useRealEstateId()

  return useMutation({
    mutationFn: (data: IData) =>
      publishMaintenancePlan(data).then((x) => {

        if (realEstateId) {
          // query invalidations
          client.invalidateQueries(useEditableMaintenancePlan.key(realEstateId))
          client.removeQueries(useEditableMaintenancePlan.key(realEstateId))

          client.invalidateQueries(useLiveMaintenancePlan.key(realEstateId))
          client.removeQueries(useLiveMaintenancePlan.key(realEstateId))

          client.invalidateQueries(useMaintenancePlanVersions.key(realEstateId))
          client.invalidateQueries(useMaintenancePlanVersionById.key(data.maintenancePlanId))
        }

        return x.data;
      }),
  });
};
