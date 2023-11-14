// 3rd party libraries
import React, { PropsWithChildren, ReactNode, useId } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { usePathParamV2 } from '@project/ui';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { TopBar } from '@thor-frontend/features/layouts/top-bar';
import { TruncatedText } from '@thor-frontend/common/truncated-text/truncated-text';
import { TooltipBox } from '@project/ui';

// Application
import { IRealEstateSubRoute, RealEstateSubRoutes, } from './real-estate-sub-routes';



interface SubPageProps extends PropsWithChildren {
  title?: string;
  topBarChildren?: ReactNode;
}

const RealEstateSubPage = (props: SubPageProps) => {
  const history = useHistory();
  const location = history?.location;
  const id = useId();

  // state
  const [realEstateId] = usePathParamV2('id');

  const userQuery = useCurrentUser();
  const realEstatesQuery = useRealEstates(userQuery.data?._id);
  const realEstates = realEstatesQuery.data;

  const selectedEstate = realEstates.find((x) => x._id === realEstateId);

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
        {RealEstateSubRoutes.map(
          (subRoute: IRealEstateSubRoute, index: number) => {
            // Output empty div if not in sidebar
            if (subRoute.hideInSidebar)
              return <div key={`menu-item-${index}-key`} />;
            // Else
            const subRoutePath = `${ThorPaths.EJENDOMME}/${realEstateId}${subRoute.path}`;

            const isActive = location.pathname.indexOf(subRoutePath) !== -1;

            const textColorClassName = isActive
              ? 'text-black'
              : 'text-neutral-500';

            return (
              <div
                key={`menu-item-${subRoute.header.toLowerCase()}-key`}
                className="px-3"
              >
                <div
                  className={classNames(
                    `flex items-center py-2 my-1 px-3 w-full transition-all min-h-max whitespace-nowrap rounded-xl`,
                    {
                      hidden: false,
                      'bg-black/5': isActive,
                      'hover:bg-black/5 ': !isActive,
                      'cursor-pointer': !subRoute.isDisabled,
                      'cursor-default': subRoute.isDisabled,
                    }
                  )}
                  data-tooltip-id={id}
                  data-tooltip-content={
                    subRoute.isDisabled ? subRoute.disabledTooltip : ''
                  }
                  onClick={() => {
                    if (subRoute.isDisabled) return;
                    navigateHandler(subRoutePath);
                  }}
                >
                  <div className={classNames('flex w-full relative')}>
                    <div
                      className={classNames(
                        'relative items-center',
                        textColorClassName,
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
                        className={classNames(
                          'ml-4 font-medium',
                          textColorClassName
                        )}
                      >
                        {subRoute.header}
                      </p>
                    </div>
                  </div>
                </div>
                {subRoute.isDisabled ? (
                  <TooltipBox id={id} place="right" />
                ) : (
                  ''
                )}
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
        className={`ease-in-out duration-300 w-[240px] h-screen flex flex-col border-r border-neutral-200 bg-neutral-50 sticky top-0 z-[12]`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className={`mt-6 mb-3 px-3 py-2 mx-3 flex flex-row cursor-pointer rounded-xl group`}
            onClick={goBack}
          >
            <li className="ri-arrow-left-s-line text-[24px] bg-black/5 rounded-full leading-[24px] list-none group-hover:bg-black group-hover:text-white "></li>

            <TruncatedText
              tooltipProps={{ place: 'right' }}
              className="ml-3 font-medium"
            >
              {selectedEstate?.unionName}
            </TruncatedText>
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
      <div
        className="grow h-screen overflow-auto"
        style={{ maxWidth: 'calc(100% - 240px)' }}
      >
        <TopBar title={props.title} children={props.topBarChildren} />
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default RealEstateSubPage;
