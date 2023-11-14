// 3rd party libraries
import React, { ReactElement } from 'react';

// Workspace libraries
import { Select as InnerSelect, ISelectProps as IInnerSelectProps, } from '@project/ui/select';



const ThorSelectDefaults: Partial<IInnerSelectProps<unknown>> = {
  colorClassName: 'bg-white',
  optionsClassName:
    'max-h-60 overflow-y-scroll border-neutral-200 rounded-xl text-base',
  className:
    'shadow-none w-[200px] rounded-xl text-base font-medium shadow-sm border border-neutral-200',
  hoverClassName: 'hover:bg-black/5 rounded-xl',
  showRemixIcon: true,
  remixIconClass: 'ri-expand-up-down-line',
  textColorClass: 'text-black',
  textClass: 'font-medium text-base truncate',
  icon: null,
} as const;

export type ISelectProps<T> = IInnerSelectProps<T>;

/**
 * Select element. Renders a dropdown that allows the user
 * to pick between a set of predefined value options.
 *
 * Wraps the Select element of the UI library providing
 * Thor-specific styling defaults.
 *
 */
export const Select = <T,>(props: ISelectProps<T>): ReactElement => {
  const merged = Object.assign({}, ThorSelectDefaults, props);

  return <InnerSelect {...merged} />;
};
