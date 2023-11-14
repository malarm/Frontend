// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { CreateMaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/dtos/create-maintenance-plan-version.dto'
import { RealEstateJSON } from '@project/shared/feature-real-estates/interfaces/real-estate.interface';
import apiClient from '@thor-frontend/common/api-client';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useMaintenancePlanVersions } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version';
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';



export const createMaintenancePlanVersion = (
  dto: CreateMaintenancePlanVersionJSON
) => {
  return apiClient.post<RealEstateJSON>(`/maintenance-plan-versions`, dto);
};

export const useCreateMaintenancePlanVersion = () => {

  const client = useQueryClient()
  const realEstateId = useRealEstateId()

  return useMutation({
    mutationFn: (dto: CreateMaintenancePlanVersionJSON) =>
      createMaintenancePlanVersion(dto).then((x) => {

        if (realEstateId) {
          client.invalidateQueries(
            useEditableMaintenancePlan.key(realEstateId)
          )

          client.invalidateQueries(
            useMaintenancePlanVersions.key(realEstateId)
          )
        }

        return x.data;
      }),
  });
};
