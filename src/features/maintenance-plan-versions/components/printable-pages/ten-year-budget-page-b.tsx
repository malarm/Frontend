// 3rd party libraries
import React from 'react'

// Workspace libraries
import { addZero } from '@project/ui/utils'
import { Budget__RowJSON } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { range } from '@project/shared/common/utils/range.util'
import { RealEstate__BudgetJSON } from '@project/shared/feature-real-estate-budgets/types/real-estate-budget.type'
import { HR } from '@project/ui/common/hr'
import { SectionHeader } from '@project/ui/printable'
import { Landscape } from '@project/ui/printable/components/landscape'
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table'
import { formatNumber } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount'



export type ITenYearBudgetPageBProps = {
  realEstateBudget: RealEstate__BudgetJSON
  unionName: string

  /**
   * "Bolig- og erhvervsareal"
   */
  area: string
}

/**
 * Component description
 */
export const TenYearBudgetPageB: React.FC<ITenYearBudgetPageBProps> = (props) => {

  const {
    realEstateBudget
  } = props

  const {
    startYear,
    numberOfYears,
    cardsTotalRow,
    totalExMomsRow,
    totalInclMomsRow,
    totalOverAreaRow,
    customRows,

  } = realEstateBudget

  const years = range(
    startYear,
    startYear + numberOfYears - 1
  )

  const rows = [
    {
      ...cardsTotalRow,
      label: 'Håndværkerudgifter (overført)'
    },
    ...customRows,
    totalExMomsRow
  ]

  return <Landscape>

    <div className="grid grid-flow-row content-between h-full">
      <div>
        <ThorTable
          data={rows}
          columns={[
            {
              header: 'Byggesagsudgift',
              cell: data => data.label,
            },
            ...(years.map((year, index) => ({
              header: year,
              cell: (data: Budget__RowJSON) => formatNumber(data.expensesByYear[index]),
              tdClassName: (_, defaults: string) => defaults + ' text-right',
              thClassName: (defaults: string) => defaults + ' text-right'
            }))),
            {
              header: 'Total',
              cell: data => formatNumber(data.totalExpenses),
              tdClassName: () => 'py-1 px-2 bg-neutral-900/10 text-right',
              thClassName: (defaults: string) => defaults + ' text-right'
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
              className: 'py-1 px-2'
            }
          }}
          additionalRows={({ tdProps, trProps }) => {

            const tdClassName = (tdProps.className ?? '').replace(/odd:bg[^\s]+/, '') + ' bg-pine text-white px-2'

            return <>

              {/* samlet sum inkl moms */}
              <tr {...trProps}>
                <td {...tdProps} className={tdClassName}>{totalInclMomsRow.label}</td>
                {totalInclMomsRow.expensesByYear.map(amount => {

                  return <td {...tdProps} className={tdClassName + ' text-right'}>{formatNumber(amount)}</td>
                })}
                <td {...tdProps} className={tdClassName + ' text-right'}>{formatNumber(totalInclMomsRow.totalExpenses)}</td>
              </tr>

              <tr {...trProps}>
                <td {...tdProps}>{totalOverAreaRow.label}</td>
                {totalOverAreaRow.expensesByYear.map(amount => {

                  return <td {...tdProps} className={tdProps.className + ' text-right'}>{formatNumber(amount)}</td>
                })}
                <td {...tdProps} className={`${tdProps.className ?? ''} bg-neutral-900/10  text-right`}>{formatNumber(totalOverAreaRow.totalExpenses)}</td>
              </tr>
            </>
          }}
        ></ThorTable>

        <div className="grid gap-x-8 gap-y-2 mt-12" style={{ gridTemplateColumns: 'max-content 1fr' }}>
          <p className="">Gennemsnitspris / m² /år</p>
          <p className="">{Math.round(totalOverAreaRow.totalExpenses / realEstateBudget.numberOfYears)},-</p>
          <p className="">Bolig- og erhvervsareal</p>
          <p className="">{props.area} m²</p>
        </div>
      </div>

      <div>
        <p className="mt-6 italic text-neutral-500">Alle beløb er angivet i hele kroner.</p>
        <p className="mt-6 italic text-neutral-500">Ovenstående budget er ekskl. udgifter til finansiering, forsikringer, administrationshonorar og miljøsanering.</p>
      </div>
      {/* <HR color='bg-slate' className='mt-12' /> */}

    </div>


  </Landscape>
}