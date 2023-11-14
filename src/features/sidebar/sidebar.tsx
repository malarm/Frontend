// 3rd party libraries
import classNames from 'classnames';
import React, { useId } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Workspace libraries
import { TooltipBox } from '@project/ui';
import { TruncatedText } from '@thor-frontend/common/truncated-text/truncated-text';
import { useOrganization } from '@thor-frontend/features/organizations/queries';
import { useIsCollapsed } from '@thor-frontend/features/sidebar/use-is-collapsed';
import { useMenuItems } from '@thor-frontend/features/sidebar/use-menu-item';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';

// Application
import { IconsUpsite } from '../../assets/svg';



/**
 * Upsite sidebar
 */
const Sidebar: React.FC = React.memo((props) => {
  const id = useId();

  const isCollapsed = useIsCollapsed();
  const history = useHistory();

  const currentUser = useCurrentUser().data;
  const organizationsQuery = useOrganization(
    currentUser?.organizations[0]?.organizationId
  );

  const location = useLocation();
  const MenuItems = useMenuItems();

  const organizationName = organizationsQuery?.data?.name ?? ' ';

  const goBack = () => {
    history.push(ThorPaths.EJENDOMME);
  };

  return (
    <div
      key={id}
      className={`relative h-screen ${isCollapsed ? 'w-[89px]' : 'w-[215px]'}`}
    >
      <div
        className={`transition-all duration-150 flex flex-col gap-6 px-4 py-8 border-r border-neutral-200 bg-neutral-50 absolute left-0 top-0 h-full z-[21] ${isCollapsed ? 'w-[89px]' : 'w-[215px]'
          }`}
      >
        {/* logo */}
        <IconsUpsite className="ml-4 w-[18px] h-[24px] cursor-pointer" onClick={goBack} />

        {/* Organization name */}
        {organizationName ? (
          <TruncatedText
            tooltipProps={{ place: 'right' }}
            className={'text-black font-medium ml-4 max-w-full'}
          >
            {organizationName}
          </TruncatedText>
        ) : (
          ''
        )}

        {/* navigation items */}
        <div className="flex flex-col gap-2 w-max">
          {MenuItems.map(({ icon, name, url, isDisabled, disabledTooltip }) => {
            const isActive = location.pathname.indexOf(url) === 0;
            const id = `sidemenu-tooltip-${url}`;

            const textColorClassName = isActive
              ? 'text-black'
              : 'text-neutral-500';

            return (
              <>
                <div
                  onClick={() => {
                    if (isDisabled) return;
                    history.push(url);
                  }}
                  className={classNames(
                    'flex gap-4 items-center py-2 px-4 transition-all whitespace-nowrap rounded-xl group',
                    {
                      'bg-black/5': isActive,
                      'hover:bg-black/5': !isActive,
                      'cursor-pointer': !isDisabled,
                      'cursor-default': isDisabled,
                    }
                  )}
                  data-tooltip-id={id}
                  data-tooltip-content={isDisabled ? disabledTooltip : name}
                >
                  <i
                    className={`${icon} text-[24px] leading-[24px] ${textColorClassName} font-medium`}
                  ></i>
                  <div
                    className={`transition-all duration-150 ${isCollapsed ? 'w-0 -mr-4' : 'w-[110px]'
                      } whitespace-nowrap overflow-hidden ${textColorClassName} font-medium`}
                  >
                    {name}
                  </div>
                </div>

                {/* tooltip */}
                {(isCollapsed || isDisabled) ? <TooltipBox id={id} place="right" /> : ''}

              </>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
