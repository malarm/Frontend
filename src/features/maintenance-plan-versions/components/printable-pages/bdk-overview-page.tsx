// 3rd party libraries
import React from 'react'

// Workspace libraries
import { addZero } from '@project/ui/utils'
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type'
import { SectionHeader } from '@project/ui/printable/components/section-header'
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table'
import { getConditionText } from '@thor-frontend/features/maintenance-plan-versions/components/contition-bdk-list'
import { ConditionItemV2 } from '@thor-frontend/features/real-estate-cards/components/condition-item-v2'



export type IBDKOverviewPageProps = {

  cards: RealEstateCardJSON[]

}

/**
 * Component description
 */
export const BDKOverviewPage: React.FC<IBDKOverviewPageProps> = (props) => {

  return <>
    <SectionHeader sectionName={'tilstandsoversigt'}>Tilstandsoversigt</SectionHeader>
    <ThorTable
      thead={{
        th: {
          className: 'px-1 py-2 font-xs font-semibold text-black'
        }
      }}
      tbody={{
        td: {
          className: 'p-1 font-xs'
        },
        tr: {
          className: 'text-sm text-neutral-500 odd:bg-neutral-100'
        }
      }}
      data={props.cards}
      columns={[
        {
          header: 'Betegnelse',
          cell: data => `${addZero(data.number)} ${data.name}`
        },
        {
          header: 'Tilstand',
          cell: data => <div className="flex flex-row gap-2 items-center">
            <ConditionItemV2 condition={data.operationInformation.condition} />
            <p>{getConditionText(data.operationInformation.condition)}</p>
          </div>
        },
        {
          header: 'Første aktivitet',
          cell: data => {
            if (data.workTasks.length === 0) return '-'
            if (data.workTasks.length === 1) return data.workTasks[0].yearOfCompletion

            return data.workTasks
              .map(x => x.yearOfCompletion)
              .reduce(
                (a, b) => Math.min(a, b)
              )
          }
        }
      ]}

    />
  </>
}