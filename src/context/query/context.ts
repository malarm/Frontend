// Workspace libraries
import { parseUrlQuery } from '@project/shared/common/utils/parse-url-query.util';
import { getContext } from '@thor-frontend/common/utils/get-context';

// Application
import { QueryState } from './query-state.interface';



export const {
  Provider: QueryProvider,
  useContext: useQuery,
  useDispatch: useQueryDispatch,
  useState: useQueryState,
} = getContext<QueryState>({
  initialState: {
    query: parseUrlQuery(window.location.search),
  },
  reducer: (state) => state,
});
