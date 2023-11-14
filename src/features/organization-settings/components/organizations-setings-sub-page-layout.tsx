// 3rd party libraries
import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { ISettingsSubRoute, OrganizationSettingsSubRoutes, } from '@thor-frontend/features/organization-settings/organizations-settings-sub-routes';
import { TopBar } from '@thor-frontend/features/layouts/top-bar';



interface SubPageProps extends PropsWithChildren {
  title?: string;
}

const SettingsSubPage = (props: SubPageProps) => {
  const currentPath = window.location.pathname;
  const history = useHistory();
  const location = history?.location;

  const goBack = () => {
    history.push(ThorPaths.EJENDOMME);
  };

  const SubRouteItems: React.FC = () => {
    const navigateHandler = (path: string) => {
      if (location.pathname.indexOf(path) === 0) return;
      history.push(path);
    };

    return (
      <>
        {OrganizationSettingsSubRoutes.map(
          (subRoute: ISettingsSubRoute, index: number) => {
            const subRoutePath = `${ThorPaths.SETTINGS}${subRoute.path}`;
            const isActive = currentPath === subRoutePath;
            return (
              <div
                key={`menu-item-${subRoute.header.toLowerCase()}`}
                className="px-3"
              >
                <div
                  className={classNames(
                    `flex items-center py-2 my-1 px-3 w-full cursor-pointer transition-all min-h-max whitespace-nowrap rounded-xl`,
                    {
                      hidden: false,
                      'bg-black/5': isActive,
                      'hover:bg-black/5 ': !isActive,
                    }
                  )}
                  onClick={() => {
                    navigateHandler(subRoutePath);
                  }}
                >
                  <div className={classNames('flex w-full relative')}>
                    <div
                      className={classNames(
                        'relative items-center',
                        {
                          'text-neutral-500': !isActive,
                          'text-neutral-700': isActive,
                        },
                        'mr-4 flex justify-start'
                      )}
                    >
                      <i
                        className={classNames(
                          subRoute.icon,
                          'text-[24px] leading-[24px]'
                        )}
                      ></i>

                      <p
                        className={classNames('ml-4 font-medium', {
                          'text-neutral-800': isActive,
                          'text-neutral-500': !isActive,
                        })}
                      >
                        {subRoute.header}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </>
    );
  };

  const SubMenu = () => {
    return (
      <div
        className={`ease-in-out duration-300 w-[220px] h-screen flex flex-col border-r border-neutral-200 bg-neutral-50 relative`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden cursor-pointer">
          <div
            className={`mt-6 mb-3 px-3 py-2 mx-3 flex flex-row cursor-pointer rounded-xl group`}
            onClick={goBack}
          >
            <li className="ri-arrow-left-s-line text-[24px] bg-black/5 rounded-full leading-[24px] list-none group-hover:bg-black group-hover:text-white "></li>

            <span className='font-medium ml-3'>Indstillinger</span>
          </div>
          <div className={`flex flex-col`}>
            <SubRouteItems />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <SubMenu />
      <div className="grow flex flex-col h-screen">
        <TopBar title={props.title} />
        <div className="h-full overflow-auto">{props.children}</div>
      </div>
    </div>
  );
};

export default SettingsSubPage;
