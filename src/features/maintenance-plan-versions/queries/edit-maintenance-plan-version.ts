// 3rd party libraries
import { useMutation } from '@tanstack/react-query';

// Workspace libraries
import { UpdateMaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/dtos/update-maintenance-plan-version.dto';
import apiClient from '@thor-frontend/common/api-client';



export const editMaintenancePlanVersion = (
  data: IUpdateMaintenancePlanVersionMutation
) => {
  return apiClient.patch(`/maintenance-plan-versions/${data.planId}`, data.dto);
};

export const useEditMaintenancePlanVersionAsync = () => {
  return useMutation({
    mutationFn: (data: IUpdateMaintenancePlanVersionMutation) =>
      editMaintenancePlanVersion(data).then((x) => {
        return x.data;
      }),
  });
};

export interface IUpdateMaintenancePlanVersionMutation {
  dto: UpdateMaintenancePlanVersionJSON;
  planId: string;
}
