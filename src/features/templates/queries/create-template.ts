// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { CreateCustomTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/create-custom-template.dto'
import { CreateTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/create-template.dto';
import apiClient from '@thor-frontend/common/api-client';
import { useTemplatesPage } from '@thor-frontend/features/templates/queries/templates-page';
import { useSearchTemplates } from '@thor-frontend/features/templates/queries/search-templates';



// add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  dto: CreateCustomTemplateDTOJSON
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const createTemplate = (data: IData) => apiClient.post(
  `/templates`,
  data.dto
)


export const useCreateTemplate = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => createTemplate(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useTemplatesPage.key({}).slice(0, 1))
      client.invalidateQueries(useSearchTemplates.key({ phrase: '' }).slice(0, 1))

      return response.data
    })
  )
}