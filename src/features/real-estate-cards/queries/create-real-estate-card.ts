// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { CreateRealEstateCardDTOJSON } from '@project/shared/feature-real-estate-cards/types/dtos/create-real-estate-card-dto.type';
import apiClient from '@thor-frontend/common/api-client';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';



// post/patch/delete request
const createRealEstateCard = (body: CreateRealEstateCardDTOJSON) => apiClient.post(
  '/real-estate-cards',
  body
)


export const useCreateRealEstateCard = () => {

  const client = useQueryClient()

  return useMutation(
    (body: CreateRealEstateCardDTOJSON) => createRealEstateCard(body).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useCardsByMaintenancePlanVersion.key('').slice(0, 1))

      return x.data
    })
  )
}