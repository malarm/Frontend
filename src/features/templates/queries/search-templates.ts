// 3rd party libraries
import { useQuery } from '@tanstack/react-query'

// Workspace libraries
import { SearchTemplatesDTOJSON } from '@project/shared/feature-templates/types/dtos/search-templates.dto'
import apiClient from '@thor-frontend/common/api-client';



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const searchTemplates = (dto: SearchTemplatesDTOJSON) => apiClient.post(
  `/templates/search`,
  dto
)

// key
const key = (dto: SearchTemplatesDTOJSON) => {

  const {
    phrase,
    ...params
  } = dto;

  return [
    `templates`,
    'search',
    phrase,
    params
  ]
}

// query
export const useSearchTemplates = (dto: SearchTemplatesDTOJSON) => {

  return useQuery(
    key(dto),
    () => searchTemplates(dto).then(response => response.data),
    {
      // options
      // enabled: idParam != null, // prevent fetching when required param is missing
      placeholderData: [], // used as .data until fetch is complete
    }
  )
}

// make query key accessible
useSearchTemplates.key = key
