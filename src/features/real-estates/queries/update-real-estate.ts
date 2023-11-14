// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { UpdateRealEstateJSON } from '@project/shared/feature-real-estates/interfaces/update-real-estate-dto.interface';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';



// add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  realEstateId: string
  dto: UpdateRealEstateJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateRealEstate = (data: IData) => apiClient.patch(
  `/real-estates/${data.realEstateId}`,
  data.dto
)


export const useUpdateRealEstate = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateRealEstate(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(
        useRealEstateById.key(data.realEstateId)
      )

      return response.data
    })
  )
}