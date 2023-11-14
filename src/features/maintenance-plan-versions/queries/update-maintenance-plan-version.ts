// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { UpdateMaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/dtos/update-maintenance-plan-version.dto';
import apiClient from '@thor-frontend/common/api-client';
import { DefaultMutationOptions, IMutationOptions } from '@thor-frontend/common/mutation-options';
import { useMaintenancePlanVersionById, useMaintenancePlanVersionByIdAsync } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';



type IData = {
  maintenancePlanVersionId: string
  dto: UpdateMaintenancePlanVersionJSON
} // add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateMaintenancePlanVersion = (data: IData) => apiClient.patch(
  `/maintenance-plan-versions/${data.maintenancePlanVersionId}`,
  data.dto
)



export const useUpdateMaintenancePlanVersion = (options: IMutationOptions = {}) => {

  const merged = { ...DefaultMutationOptions, ...options }

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateMaintenancePlanVersion(data).then(response => {

      if (merged.invalidate) {

        // invalidate affected queries
        client.invalidateQueries(['editable-maintenance-plan'])
        client.invalidateQueries(useMaintenancePlanVersionById.key(data.maintenancePlanVersionId))
      }


      return response.data
    })
  )
}