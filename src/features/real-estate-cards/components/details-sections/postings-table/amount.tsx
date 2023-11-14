// 3rd party libraries
import React, { ReactNode } from 'react'



export const formatNumber = (num: number) => {
  return Math.round(num)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export type IAmountProps = {
  amount: number

  /**
   * 
   * Applied to the root ``<p>`` element
   */
  className?: string

  /**
   * Default is ``<span className="opacity-50 text-inherit">kr. </span>``
   * 
   * Pass ``''`` (empty string) to omit 
   */
  prefix?: ReactNode

  /**
   * Rendered after the amount
   */
  children?: ReactNode
}

/**
 * Component description
 */
export const Amount: React.FC<IAmountProps> = (props) => {

  const formatted = formatNumber(props.amount)

  return <p className={props.className ?? ''}>
    {props.prefix ?? ''}
    {formatted}
    {props.children}
  </p>
}

Amount.defaultProps = {
  prefix: <span className="opacity-50 text-inherit">kr. </span>,
  className: ''
}