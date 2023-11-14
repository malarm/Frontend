// 3rd party libraries
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import classNames from 'classnames';

// Workspace libraries
import routes from '@thor-frontend/routing/routes';
import AppRoute from '@thor-frontend/routing/app-route';
import Sidebar from '@thor-frontend/features/sidebar/sidebar';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import UpsiteAiChatbot from '@thor-frontend/features/upsite-ai/components/upsite-ai-chatbot';
import { ConfirmProvider } from '@thor-frontend/common/modal/use-confirm-modal';
import { RedirectIfLockedRealEstate } from '@thor-frontend/features/real-estates/components/redirect-if-locked-real-estate';
import { MaintenancePlanVersionPrintable } from '@thor-frontend/features/maintenance-plan-versions/pages/maintenance-plan-version-printable';



/**
 * Paths on which we hide the side menu and UpsiteAI chat
 */
const publicPaths = [ThorPaths.LOGIN, ThorPaths.ACTIVATE] as string[];

const App: React.FC = () => {
  return (
    <Router>
      <Switch>

        {/* render VP */}
        <AppRoute
          path={ThorPaths.MAINTENANCE_PLAN_VIEW + '/:maintenancePlanVersionId'}
          component={MaintenancePlanVersionPrintable}
          isPrivate={true}
          exact={true}
        />

        {/* ... or everything else */}
        <Route>
          <div
            className={classNames('w-screen h-screen grid overflow-y-auto')}
            style={{ gridTemplateColumns: 'max-content 1fr' }}
          >
            <Router>
              <Route
                render={(props) => {
                  const pathname = props.location.pathname;

                  if (
                    publicPaths.includes(pathname) ||
                    pathname.indexOf(ThorPaths.MAINTENANCE_PLAN_VIEW) === 0
                  ) {
                    return '';
                  }

                  return <UpsiteAiChatbot />;
                }}
              />

              <Route
                render={(props) => {
                  const pathname = props.location.pathname;

                  // Omit sidebar when we are in the BDK details view, login or activation page:
                  if (
                    publicPaths.includes(pathname) ||
                    /bdk\/[a-zA-Z0-9]{24}/.test(pathname) ||
                    pathname.indexOf(ThorPaths.MAINTENANCE_PLAN_VIEW) === 0
                  ) {
                    return <div></div>;
                  }

                  return <Sidebar />;
                }}
              />

              <Route path={`${ThorPaths.EJENDOMME}/:id`}>
                <RedirectIfLockedRealEstate />
              </Route>

              {/* Map Routes */}
              <Switch>
                {routes.map((route) => (
                  <AppRoute key={route.path} {...route} />
                ))}
              </Switch>
            </Router>
          </div>
          <ConfirmProvider />
          <ToastContainer transition={Slide} position="bottom-right" />
        </Route>


      </Switch>
    </Router>
  );
};

export default App;
