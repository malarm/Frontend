// 3rd party libraries
import classNames from 'classnames'
import React from 'react'

// Workspace libraries
import { RealEstateCardSummaryJSON } from '@project/shared/feature-real-estate-cards/projections/real-estate-card-summary.projection'
import { Checkbox } from '@thor-frontend/common/checkbox/checkbox'



export type IInactiveCardItemProps = {
  item: RealEstateCardSummaryJSON,
  isSelected: boolean
  setIsSelected: (value: boolean) => void
}

/**
 * Component description
 */
export const InactiveCardItem: React.FC<IInactiveCardItemProps> = (props) => {



  return <div className={classNames(
    'p-4 flex justify-between rounded-xl cursor-pointer transition-colors duration-75 ease-in-out',
    { 'bg-black bg-opacity-5 hover:bg-opacity-10': !props.isSelected },
    { 'bg-mint': props.isSelected },
  )}
    onClick={() => props.setIsSelected(!props.isSelected)}
  >
    <p>{props.item.name}</p>
    <Checkbox
      isChecked={props.isSelected}
    ></Checkbox>
  </div>
}