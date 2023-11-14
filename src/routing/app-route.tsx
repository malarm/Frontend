// 3rd party libraries
import React, { useMemo } from 'react';
import { Route, RouteProps, Redirect, useLocation } from 'react-router-dom';

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { useSetRedirectToPathOnLogin, useTokenStore } from '@thor-frontend/features/login/login.store';



type PrivateRouteProps = RouteProps & {
  redirectTo?: string;
  isPrivate?: boolean;
  path: string;
};

const AppRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isPrivate,
  redirectTo,
  ...rest
}) => {

  const location = useLocation()

  const token = useTokenStore((store) => !!store.token);
  const shouldRedirect = useMemo(() => !token && isPrivate, [token, isPrivate]);
  const setRedirectToPathOnLogin = useSetRedirectToPathOnLogin()

  if (shouldRedirect && location.pathname && location.pathname.length > 1) {
    setRedirectToPathOnLogin(location.pathname)
  }

  // ====== DEV ONLY
  // const shouldRedirect = false;
  // ====== DEV ONLY

  return (
    <Route
      {...rest}
      render={(props) =>
        shouldRedirect ? (
          <Redirect
            to={{
              pathname: redirectTo ?? ThorPaths.LOGIN,
              state: { from: rest.location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default AppRoute;
