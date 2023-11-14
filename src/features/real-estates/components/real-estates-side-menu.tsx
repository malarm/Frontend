// 3rd party libraries
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { usePathParamV2 } from '@project/ui';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';

// Application
import { IRealEstateSubRoute, RealEstateSubRoutes, } from '../real-estate-sub-routes';



export type IRealEstatesSidebarProps = {
  // 
}

/**
 * Component description
 */
export const RealEstatesSidebar: React.FC<IRealEstatesSidebarProps> = (props) => {

  const currentPath = window.location.pathname;
  const history = useHistory();
  const location = history?.location;

  // state
  const [activeSubRoute, setActiveSubRoute] = React.useState(currentPath);
  const [realEstateId, setRealEstateId] = usePathParamV2('id');

  // @ts-expect-error lalaldsfsadfasdflsa
  window.setRealEstateId = setRealEstateId;

  useEffect(() => {
    console.log(
      'realEstateId updated (real-estate-sub-page-layout.tsx)',
      realEstateId
    );
  }, [realEstateId]);

  const userQuery = useCurrentUser();
  const realEstatesQuery = useRealEstates(userQuery.data?._id);
  const realEstates = realEstatesQuery.data;

  const selectedEstate = realEstates.find((x) => x._id === realEstateId);

  const goBack = () => {
    history.push(ThorPaths.EJENDOMME);
  };

  const SubRouteItems: React.FC = () => {
    const navigateHandler = (path: string) => {
      setActiveSubRoute(path);
      if (location.pathname.indexOf(path) === 0) return;
      history.push(path);
    };

    return (
      <>
        {RealEstateSubRoutes.map(
          (subRoute: IRealEstateSubRoute, index: number) => {
            if (subRoute.hideInSidebar)
              return <div key={`menu-item-${index}-key`} />;
            const subRoutePath = `${ThorPaths.EJENDOMME}/${realEstateId}${subRoute.path}`;
            const isActive = currentPath === subRoutePath;
            return (
              <div
                key={`menu-item-${subRoute.header.toLowerCase()}-key`}
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
                      {/* {dropdownIconFunction()}*/}
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

  return <div
    className={`ease-in-out duration-300 w-[240px] h-screen flex flex-col border-r border-neutral-200 bg-neutral-50 sticky top-0`}
  >
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <div
        className={`mt-6 mb-3 px-3 py-2 mx-3 flex flex-row cursor-pointer rounded-xl group`}
        onClick={goBack}
      >
        <li className="ri-arrow-left-s-line text-[24px] bg-black/5 rounded-full leading-[24px] list-none group-hover:bg-black group-hover:text-white "></li>
        <p className="truncate ml-3 font-medium ">
          {selectedEstate?.unionName}
        </p>
      </div>
      <div className={`flex flex-col`}>
        <SubRouteItems />
      </div>
    </div>
  </div>

}