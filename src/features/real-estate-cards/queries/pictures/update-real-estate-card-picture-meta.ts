// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { UpdateMEDocumentMetaJSON } from '@project/shared/feature-me-document/interfaces/dtos/update-me-document-meta-dto.type'
import apiClient from '@thor-frontend/common/api-client';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { DefaultMutationOptions, IMutationOptions } from '@thor-frontend/common/mutation-options';



type IData = {
  realEstateCardId: string
  pictureId: string
  body: UpdateMEDocumentMetaJSON

} // add body type here, eg 'UpdateUserDTO' or { userId: string }

// post/patch/delete request (replace 'update' appropriately if needed)
const updateRealEstateCardPictureMeta = (data: IData) => apiClient.patch(
  `/real-estate-cards/${data.realEstateCardId}/pictures/${data.pictureId}/meta`,
  data.body
)


export const useUpdateRealEstateCardPictureMeta = (options: IMutationOptions = {}) => {

  const merged = { ...DefaultMutationOptions, ...options }

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateRealEstateCardPictureMeta(data).then(x => {

      if (merged.invalidate) {
        // invalidate affected queries
        client.invalidateQueries(useRealEstateCardById.key(data.realEstateCardId))
      }

      return x.data
    })
  )
}