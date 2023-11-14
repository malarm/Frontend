// 3rd party libraries
import classNames from 'classnames';
import React, { ReactNode, useId } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { DropDownCard, TooltipBox } from '@project/ui';
import { UserAvatar } from '@thor-frontend/common/avatar/user-avatar';
import { useTokenStore } from '@thor-frontend/features/login/login.store';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useQuery } from '@thor-frontend/context/query';
import UpdateUsersModal from '@thor-frontend/features/users/modals/update-users.modal';
import { getCDNUrl } from '@thor-frontend/common/utils';
import { getUserProfilePictureUrl } from '@thor-frontend/common/utils/get-user-profile-picture-url';



export interface TopBarProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = (props) => {
  const id = useId();
  const currentUser = useCurrentUser().data;
  const firstName = currentUser?.name.split(' ')[0];
  const lastNameInitial = currentUser?.name.split(' ')[1]?.charAt(0);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [showEditUsersList, setshowEditUsersList] = React.useState(false);

  // Store
  const token = useTokenStore((x) => x.token);

  // Hooks
  // History
  const history = useHistory();

  // Context
  const { dispatch: queryDispatch } = useQuery();

  const queryClient = useQueryClient();

  const resetToken = useTokenStore((store) => store.resetToken);

  const logOut = async () => {
    queryDispatch({
      type: null,
    });

    history.push('/');
    resetToken(queryClient);
  };

  return (
    <div className={`sticky top-0 bg-white z-[11] ${props.className ?? ''}`}>
      <UpdateUsersModal
        isOpen={showEditUsersList}
        onRequestClose={() => setshowEditUsersList(false)}
        confirmHandler={() => null}
      />
      <div className="flex justify-between py-4 px-8 items-center">
        <div>
          <p className="text-xl">{props.title}</p>
        </div>
        <div className="flex justify-between cursor-pointer">
          <div
            className={classNames(
              'py-2 my-1 mr-2 hover:bg-black/5 top-0 rounded-xl self-center flex'
            )}
            data-tooltip-id={id}
            data-tooltip-content={'Support'}
          >
            <a
              href="https://upsiteapp.com/kontakt"
              target={'_blank'}
              rel="noreferrer"
            >
              <i className="ri-customer-service-2-line text-[24px] leading-[24px] px-4 relative text-neutral-500 flex"></i>
            </a>
            <TooltipBox id={id} place="bottom" />
          </div>
          {/* <div
            className={classNames(
              'py-2 my-1 mr-2 hover:bg-black/5 top-0 rounded-xl self-center flex'
            )}
          >
            <i className="ri-notification-3-line text-[24px] leading-[24px] px-4 relative text-neutral-500"></i>
          </div> */}
          <div
            className={classNames(
              'hover:bg-black/5 flex my-1 px-4 py-2 rounded-xl',
              openMenu && 'bg-black/5'
            )}
            onClick={(ev) => {
              ev.stopPropagation();
              setOpenMenu(!openMenu);
            }}
          >
            <UserAvatar
              className="item-center self-center"
              sizeClassName='w-6 h-6'
              url={getUserProfilePictureUrl(currentUser)}
              roundedClassName={'rounded-lg'}
              iconSizeClassName={'text-[20px]'}
            />
            <span className="mx-2 text-neutral-500 font-medium relative self-center ml-4">
              {`${firstName} ${lastNameInitial || ''}`}.
            </span>
          </div>
          <DropDownCard
            className={classNames(
              'z-50 top-14 mt-4 rounded-md absolute min-w-[120px]',
              {
                block: openMenu,
                hidden: !openMenu,
              }
            )}
            data={[
              {
                title: 'Min profil',
                className: 'hover:bg-black/5',
                action: () => {
                  setshowEditUsersList(true);
                },
              },
              {
                title: 'Log ud',
                className: 'hover:bg-black/5',
                action: () => logOut(),
              },
            ]}
            setOpen={setOpenMenu}
            open={openMenu}
          />
        </div>
      </div>
      {props.children}
    </div>
  );
};
