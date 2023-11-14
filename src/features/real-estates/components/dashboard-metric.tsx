// 3rd party libraries
import React, { ReactNode } from 'react'
import useAnimateNumber from 'react-hook-animate-number';

// Workspace libraries
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';



export type IDashboardMetricProps = {

  value: number

  label: ReactNode

  children?: ReactNode

  /**
   * If true, opacity of the rendered number and labels
   * will be lowered
   */
  reduceOpacity?: boolean
}

/**
 * A box with a large number and label, animated to count up from 0.
 */
export const DashboardMetric: React.FC<IDashboardMetricProps> = (props) => {

  const valueAnimation = useAnimateNumber({
    number: props.value,
    durationInMs: 1250,
    easingFunctionName: 'easeOutQuint',
  });

  const opacityClass = props.reduceOpacity ? 'opacity-50' : ''

  return <div className="p-6 rounded-xl bg-neutral-100 flex flex-col gap-4">
    <p className={`text-6xl ${opacityClass}`}><Amount className="text-4xl" prefix={''} amount={valueAnimation.number}> kr.</Amount></p>
    <p className={`text-black text-sm ${opacityClass}`}>{props.label}</p>
    {props.children}
  </div>
}