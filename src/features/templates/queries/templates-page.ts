// 3rd party libraries
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Workspace libraries
import { GetTemplatesDTOJSON } from '@project/shared/feature-templates/types/dtos/get-templates.dto'
import { PaginationResult } from '@project/shared/common/types/pagination-result.type'
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type';
import apiClient from '@thor-frontend/common/api-client';



type IData = {
  query?: GetTemplatesDTOJSON;
};

// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getTemplatesPage = (data: IData = {}) =>
  apiClient.get<PaginationResult<TemplateJSON>>(`/templates`, {
    params: data.query,
  });

// key
const key = (data: IData) => [`templates`, data.query ?? {}];

// query
export const useTemplatesPage = (data: IData = {}) => {
  return useInfiniteQuery(
    key(data),
    ({ pageParam = 0 }) =>
      getTemplatesPage({
        query: {
          page: pageParam,
          ...(data.query ?? {}),
        },
      }).then((response) => response.data),
    {
      // options
      // enabled: idParam != null, // prevent fetching when required param is missing
      // placeholderData: {
      //   pageParams: [0],
      //   pages: [{
      //     hasMore: false,
      //     items: []
      //   }]
      // }, // used as .data until fetch is complete
    }
  );
};

// make query key accessible
useTemplatesPage.key = key;
