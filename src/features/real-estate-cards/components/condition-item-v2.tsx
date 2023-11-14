// 3rd party libraries
import React, { DetailedHTMLProps, FC, HTMLAttributes, SVGProps, useId } from 'react'
import classNames from 'classnames';
import { Tooltip } from 'react-tooltip';

// Workspace libraries
import { Condition } from '@project/shared/feature-real-estate-cards/enums/condition.enum'
import { Condition1, Condition2, Condition3, Condition4, } from '@thor-frontend/assets/svg';



export type IConditionItemV2Props = {

  condition: Condition,

  /**
   * Default is ``true``
   * 
   * If true, a tooltip is rendered when the icon is hovered
   */
  renderTooltip?: boolean

  /**
   * Additional classes applied to the icon
   */
  className?: string

  /**
   * default is ``'w-6 h-6'``
   * 
   * Applied to the icon
   */
  sizeClassName?: string

  /**
   * Additional props applied to the icon
   */
  iconProps?: Omit<SVGProps<SVGSVGElement> & { title?: string; }, 'className'>
}

const getConditionText = (value: Condition): string => {
  switch (value) {
    case 0:
      return 'Meget god';

    case 1:
      return 'Acceptabel';

    case 2:
      return 'Mindre god';

    case 3:
      return 'Kritisk';

    default:
      return '';
  }
};

const getConditionIcon = (value: Condition): FC<SVGProps<SVGSVGElement> & {
  title?: string;
}> => {
  switch (value) {
    case 0:
      return Condition1;

    case 1:
      return Condition2;

    case 2:
      return Condition3;

    case 3:
      return Condition4;

    default:
      return Condition4;
  }
}

/**
 * Renders a condition icon
 */
export const ConditionItemV2: React.FC<IConditionItemV2Props> = (props) => {

  const text = getConditionText(props.condition)
  // const bgClassName = getConditionBgClassName(props.condition)
  const Icon = getConditionIcon(props.condition)

  const tooltipId = useId()

  const renderTooltip = () => {
    if (!props.renderTooltip) return ''

    return <Tooltip id={tooltipId} place={'bottom'} />
  }

  return <>
    <Icon className={classNames(props.className, props.sizeClassName)} data-tooltip-id={tooltipId} data-tooltip-content={text} />
    {renderTooltip}
  </>

}

ConditionItemV2.defaultProps = {
  sizeClassName: 'w-6 h-6',
  className: '',
  renderTooltip: true
}