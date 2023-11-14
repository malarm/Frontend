/* import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import {
  Link
} from 'react-router-dom'

type NavigationItemProps = PropsWithChildren<{
  path: string
  isActive?: boolean;
  fullwidth?: boolean;
}>

export const NavigationItem: React.FC<NavigationItemProps> = (props) => {
  const linkActive = props.isActive ?? false;
  const fullwidth = props.fullwidth ?? false;

  return <Link to={props.path} className={
    classNames("px-4 py-2 mr-2 rounded-lg font-medium text-sm hover:text-neutral-800 hover:bg-neutral-100",
      linkActive ? "bg-neutral-100 text-neutral-800 " : "text-neutral-500",
      fullwidth && "w-full")}>
    <span className='flex items-center text-inherit' > {props.children}</span>
  </Link >
};
 */