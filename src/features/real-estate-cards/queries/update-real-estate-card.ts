// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { UpdateRealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/dtos/update-real-estate-card-dto.type';
import apiClient from '@thor-frontend/common/api-client';
import { DefaultMutationOptions, IMutationOptions } from '@thor-frontend/common/mutation-options';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  body: UpdateRealEstateCardJSON,
  realEstateCardId: string
} // add body type here, eg 'CreateUserDTO'

// post/patch/delete request (replace 'create' appropriately if needed)
const updateRealEstateCard = (dto: IData) => apiClient.patch(
  `/real-estate-cards/${dto.realEstateCardId}`,
  dto.body
)


export const useUpdateRealEstateCard = (options: IMutationOptions = {}) => {

  const merged = { ...DefaultMutationOptions, ...options }

  const client = useQueryClient()

  return useMutation(
    (dto: IData) => updateRealEstateCard(dto).then(x => {

      if (merged.invalidate) {
        // invalidate affected queries

        client.invalidateQueries(useCardsByMaintenancePlanVersion.key('').slice(0, 1))
        client.invalidateQueries(useRealEstateCardById.key(dto.realEstateCardId))
      }


      return x.data
    })
  )
}