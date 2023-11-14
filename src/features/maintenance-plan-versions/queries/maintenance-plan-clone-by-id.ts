// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';



const clonehMaintenancePlan = (maintenancePlanId: string) =>
  apiClient.post(`/maintenance-plan-versions/clone/${maintenancePlanId}`);

export const useCloneMaintenancePlanVersion = () => {

  const client = useQueryClient()
  const realEstateId = useRealEstateId()

  return useMutation({
    mutationFn: (maintenancePlanId: string) =>
      clonehMaintenancePlan(maintenancePlanId).then((x) => {

        if (realEstateId) {
          client.invalidateQueries(
            useEditableMaintenancePlan.key(realEstateId)
          )

          client.invalidateQueries(
            useLiveMaintenancePlan.key(realEstateId)
          )

          client.invalidateQueries(
            useMaintenancePlanVersions.key(realEstateId)
          )
        }

        return x.data;
      }),
  });
};

