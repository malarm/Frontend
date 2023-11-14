// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { UpdateTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/update-template.dto';
import apiClient from '@thor-frontend/common/api-client';
import { useTemplatesPage } from '@thor-frontend/features/templates/queries/templates-page';
import { useSearchTemplates } from '@thor-frontend/features/templates/queries/search-templates';



// add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  templateId: string,
  dto: UpdateTemplateDTOJSON
}


// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const updateTemplate = (data: IData) => apiClient.patch(
  `/templates/${data.templateId}`,
  data.dto
)


export const useUpdateTemplate = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => updateTemplate(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useTemplatesPage.key({}).slice(0, 1))
      client.invalidateQueries(useSearchTemplates.key({ phrase: '' }).slice(0, 1))

      return response.data
    })
  )
}