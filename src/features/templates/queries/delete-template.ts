// 3rd party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import apiClient from '@thor-frontend/common/api-client';
import { useTemplatesPage } from '@thor-frontend/features/templates/queries/templates-page';
import { useSearchTemplates } from '@thor-frontend/features/templates/queries/search-templates';



// add data type here, eg 'DeleteUserDTO' or '{ userId: string, body: UpdateUserJSON }'
type IData = {
  templateId: string
}

// post/patch/delete request (replace 'create' and '.post' appropriately if needed)
const deleteTemplate = (data: IData) => apiClient.delete(
  `/templates/${data.templateId}`
)


export const useDeleteTemplate = () => {

  const client = useQueryClient()

  return useMutation(
    (data: IData) => deleteTemplate(data).then(response => {

      // invalidate affected queries
      client.invalidateQueries(useTemplatesPage.key({}).slice(0, 1))
      client.invalidateQueries(useSearchTemplates.key({ phrase: '' }).slice(0, 1))

      return response.data
    })
  )
}