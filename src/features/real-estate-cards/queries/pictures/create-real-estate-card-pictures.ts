// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';



type IData = {
  realEstateCardId: string,
  pictureFiles: File[]
} // add body type here, eg 'CreateUserDTO' or { userId: string }

// post/patch/delete request (replace 'create' appropriately if needed)
const createRealEstateCardPictures = (dto: IData) => {

  const form = new FormData()

  dto.pictureFiles.forEach((file, index) => {
    form.append(`picture-${index}`, file)
  })

  return apiClient.post(
    `/real-estate-cards/${dto.realEstateCardId}/pictures`,
    form
  )
}


export const useCreateRealEstateCardPictures = () => {

  const client = useQueryClient()

  return useMutation(
    (dto: IData) => createRealEstateCardPictures(dto).then(x => {

      // invalidate affected queries
      client.invalidateQueries(useRealEstateCardById.key(dto.realEstateCardId))
      client.invalidateQueries(useCardsByMaintenancePlanVersion.key('').slice(0, 1))


      return x.data
    })
  )
}