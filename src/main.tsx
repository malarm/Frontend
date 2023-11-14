// 3rd party libraries
import 'remixicon/fonts/remixicon.css'
import * as ReactDOM from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css'
import { QueryCache, QueryClient, QueryClientProvider, } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

// Workspace libraries
import '@project/ui/rich-text-editor/thor-css'
import { isAxiosError } from '@project/shared/common/utils/is-axios-error.util'
import { PaginationResult } from '@project/shared/common/types/pagination-result.type'
import { TIME_UNITS } from '@project/shared/common/constants/time-units.constant';
import { DropDownProvider } from '@project/ui';
import { Checkbox } from '@project/ui/checkbox/checkbox';
import { setDefaultErrorMessage } from '@project/ui/get-error-message'

// Application
import './styles.css'
import App from './app/app';



setDefaultErrorMessage('Der opstod en uventet fejl. Kontakt os på hello@upsiteapp.com, hvis problemet fortsætter.')

Checkbox.defaultProps = {
  checkedColor: 'bg-green',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TIME_UNITS.MINUTE * 1,
      cacheTime: TIME_UNITS.MINUTE * 2, // amount of time before cached data is garbage collected
      retry(failureCount, error) {
        if (isAxiosError(error)) {
          if ([403, 404].includes(error.response?.status ?? 0)) return false;
        }
        return failureCount < 3;
      },
      getNextPageParam: (
        lastPage: PaginationResult<unknown>,
        pages: PaginationResult<unknown>[]
      ) => {
        return lastPage && lastPage.hasMore ? pages.length : false;
      },
    },
  },
  queryCache: new QueryCache({
    onError(error, query) {
      if (isAxiosError(error)) {
        if (error.code === '401') {
          // force a refetch of the 'current-user' query. If this
          // query also fails with a 401, we reset the current token and clear the cache
          // to effectively log out
          queryClient.invalidateQueries(['current-user']);
        }
      }
    },
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

type T = React.FC<PropsWithChildren<any>>;

const providers: Array<T> = [DropDownProvider];

const Providers = providers.reduce((Acc, Cur) => ({ children }) => (
  <Acc>
    <Cur>{children}</Cur>
  </Acc>
));

root.render(
  <Providers>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Providers>
);
