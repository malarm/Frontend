// 3rd party libraries
import React from 'react'

// Workspace libraries
import { addZero } from '@project/ui/utils'
import { Budget__RowJSON } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { range } from '@project/shared/common/utils/range.util'
import { RealEstate__BudgetJSON } from '@project/shared/feature-real-estate-budgets/types/real-estate-budget.type'
import { SectionHeader } from '@project/ui/printable'
import { Landscape } from '@project/ui/printable/components/landscape'
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table'
import { formatNumber } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount'



export type ITenYearBudgetPageAProps = {
  realEstateBudget: RealEstate__BudgetJSON
  unionName: string
}

/**
 * Component description
 */
export const TenYearBudgetPageA: React.FC<ITenYearBudgetPageAProps> = (props) => {

  const {
    realEstateBudget
  } = props

  const {
    startYear,
    numberOfYears,
    cardRows: cardRowsRaw,
    cardsTotalRow
  } = realEstateBudget

  const years = range(
    startYear,
    startYear + numberOfYears - 1
  )

  const cardRows = cardRowsRaw.slice(0, 28)

  const dense = cardRows.length > 24

  return <Landscape>

    <SectionHeader sectionName='10-års budget'>
      10-års budget for {props.unionName}
    </SectionHeader>

    <ThorTable
      data={cardRows}
      columns={[
        {
          header: 'Bygningsdelskort',
          cell: data => data.label
        },
        ...(years.map((year, index) => ({
          header: year,
          cell: (data: Budget__RowJSON) => formatNumber(data.expensesByYear[index]),
          tdClassName: (item: Budget__RowJSON, defaultClassName: string) => defaultClassName + ' text-right',
          thClassName: (defaultClassName: string) => defaultClassName + ' text-right'
        }))),
        {
          header: 'Total',
          cell: data => formatNumber(data.totalExpenses),
          tdClassName: (item: any, defaultClassName: string) => defaultClassName + ' bg-neutral-900/10 text-right',
          thClassName: (defaultClassName: string) => defaultClassName + ' text-right'
        }
      ]}
      thead={{
        tr: {
          className: 'text-black border-b border-slate'
        },
        th: {
          className: 'py-2 px-2 font-bold'
        }
      }}
      tbody={{
        tr: {
          className: 'text-neutral-500 odd:bg-neutral-100'
        },
        td: {
          className: dense ? 'px-2 text-sm py-[2px]' : 'py-1 px-2'
        }
      }}
      additionalRows={({ tdProps, trProps }) => {

        const tdClassName = (tdProps.className.replace(/odd:bg[^\s]+/, '') ?? '') + ' bg-pine text-white px-2'

        return <tr {...trProps}>
          <td {...tdProps} className={tdClassName}>Håndværkerudgifter i alt ekskl. moms:</td>
          {cardsTotalRow.expensesByYear.map(amount => {

            return <td className={tdClassName + ' text-right'}>{formatNumber(amount)}</td>
          })}
          <td className={tdClassName + ' text-right'}>{formatNumber(cardsTotalRow.totalExpenses)}</td>
        </tr>
      }}
    ></ThorTable>
  </Landscape>
}