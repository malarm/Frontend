// 3rd party libraries
import React from 'react'

// Workspace libraries
import { addZero } from '@project/ui/utils'
import { end } from '@project/shared/common/utils/end.util'
import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { range } from '@project/shared/common/utils/range.util'
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type'
import { WorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/work-task.interface'
import { WorkTaskRequestLifecycle } from '@project/shared/feature-work-tasks/enums/work-task-request-lifecycle.enum'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum'
import { SectionHeader } from '@project/ui/printable'
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount'



export type IPrioritizaionPageProps = {
  startYear: number
  realEstateCards: RealEstateCardJSON[]
  indexRegulation: number
}



export const PrioritizationPage: React.FC<IPrioritizaionPageProps> = (props) => {

  const periodOneYears = range(props.startYear, props.startYear + 2)
  const periodTwoYears = range(props.startYear + 3, props.startYear + 6)
  const periodThreeYears = range(props.startYear + 7, props.startYear + 9)

  const allWorkTasks = props.realEstateCards.flatMap(card => card.workTasks)

  const cardsByYear = (years: number[]) => props.realEstateCards
    .filter(x => x.workTasks.some(y => years.includes(y.yearOfCompletion)))

  const workTasksByYear = (years: number[]) => allWorkTasks
    .filter(workTask => years.includes(workTask.yearOfCompletion))

  const sumWorkTaskExpenses = (workTasks: WorkTaskJSON[]) => workTasks
    .map(getWorkTaskExpense(props.indexRegulation))
    .reduce((a, b) => a + b, 0)

  const expensesByYearAndWorkTaskType = (years: number[], type: WorkTaskType) => {

    return workTasksByYear(years)
      .filter(x => x.workTaskType === type)
      .map(getWorkTaskExpense(props.indexRegulation))
      .reduce((a, b) => a + b, 0)
  }

  const totals = [
    sumWorkTaskExpenses(workTasksByYear(periodOneYears)),
    sumWorkTaskExpenses(workTasksByYear(periodTwoYears)),
    sumWorkTaskExpenses(workTasksByYear(periodThreeYears)),
  ]

  const highestTotal = totals.reduce(
    (a, b) => Math.max(a, b),
    0
  )

  const getColumnData = (label: string, years: number[]) => {

    const totalExpenses = workTasksByYear(years)
      .map(getWorkTaskExpense(props.indexRegulation))
      .reduce((a, b) => a + b, 0)

    return {
      label,
      years: years,
      cards: cardsByYear(years),
      expensesByWorkTaskType: {
        maintenance: expensesByYearAndWorkTaskType(years, 'maintenance'),
        operating: expensesByYearAndWorkTaskType(years, 'operating'),
        improvement: expensesByYearAndWorkTaskType(years, 'improvement'),
      },
      totalExpenses,
      fraction: totalExpenses / highestTotal
    }
  }

  const columnData: Array<{
    label: string
    years: number[]
    cards: RealEstateCardJSON[]
    expensesByWorkTaskType: {
      maintenance: number
      operating: number
      improvement: number
    },
    totalExpenses: number,
    fraction: number
  }> = [
      getColumnData('Periode 01', periodOneYears),
      getColumnData('Periode 02', periodTwoYears),
      getColumnData('Periode 03', periodThreeYears),
    ]

  return <div className="a4-inner grid gap-5" style={{ gridTemplateRows: 'max-content 1fr' }}>

    {/* static content */}
    <div>
      <SectionHeader sectionName='Priotering af vedligeholdelsesudgifter'>Priotering af vedligeholdelsesudgifter</SectionHeader>

      <p className="mb-6">
        Nedenfor vises vedligeholdelsesudgifter for de næste 10 år inddelt i tre perioder. Det er et forslag til, hvordan I bør gribe vedligeholdelsesplanen an, så I får jeres ejendoms tilstand op på et acceptabelt niveau. Bemærk venligst, at alle priser er ekskl. moms og uden byggesagsomkostninger.
      </p>

      {/* legend */}
      <div className="flex flex-row gap-4">
        <div className="flex flex-row gap-1 items-center">
          <div className="w-3 h-3 bg-pine"></div>
          <p className="neutral-500">Vedligehold</p>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <div className="w-3 h-3 bg-slate"></div>
          <p className="neutral-500">Drift</p>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <div className="w-3 h-3 bg-green"></div>
          <p className="neutral-500">Forbedring</p>
        </div>
      </div>
    </div>

    {/* columns */}
    <div
      className="w-full grid-flow-dense grid grid-cols-3 auto-cols-fr gap-x-12 relative"
      style={{ gridTemplateRows: 'max-content max-content 1fr max-content' }}
    >
      {columnData.map(({
        cards,
        expensesByWorkTaskType,
        label,
        years,
        totalExpenses,
        fraction
      }, index) => {

        const colPositionClassName = (() => {
          if (index === 0) return 'col-start-1 col-end-1'
          if (index === 1) return 'col-start-2 col-end-2'
          return 'col-start-3 col-end-3'
        })();

        const pct = Math.round(fraction * 100)
        const maintenancePct = Math.round(expensesByWorkTaskType.maintenance / totalExpenses * 100)
        const operatingPct = Math.round(expensesByWorkTaskType.operating / totalExpenses * 100)
        const improvementPct = Math.round(expensesByWorkTaskType.improvement / totalExpenses * 100)

        const colWidth = 203
        const gap = 36

        const left = colWidth * (index + 1) + gap * (index + 0.5)

        return <>

          {/* divider */}
          {index < 2
            ? <div className="absolute h-full w-[1px] bg-slate" style={{ left: `${left}px` }}></div>
            : ''}


          <h3 className={colPositionClassName + ' text-3xl text-black mb-2'}>
            {years[0]} - {end(years)}
          </h3>
          <p className={colPositionClassName}>{label}</p>

          {/* bar container */}
          <div className={colPositionClassName + ' grid relative mt-[70px]'} style={{ gridTemplateRows: 'max-content 1fr' }}>

            {/* bar area */}
            <div
              className="bg-red-500 w-[60px] absolute bottom-0 flex flex-col"
              style={{
                height: `calc(${pct}%)`
              }}>

              {/* improvements */}
              <div className="w-full bg-green" style={{ height: `${improvementPct}%` }}></div>

              {/* operating */}
              <div className="w-full bg-slate" style={{ height: `${operatingPct}%` }}></div>

              {/* maintenance */}
              <div className="w-full bg-pine" style={{ height: `${maintenancePct}%` }}></div>

            </div>


            {/* amount label */}
            <div className="absolute" style={{ bottom: pct === 0 ? '0' : `calc(${pct}%)` }}>
              <Amount className="text-xl text-black whitespace-nowrap mb-2" amount={totalExpenses}></Amount>
            </div>
          </div>

          {/* bdk list */}
          <div className={colPositionClassName + ' flex flex-col mt-2'}>
            <p className="text-sm text-black mb-1 font-medium">Bygningsdelskort:</p>
            {cards.map(card => <p className="text-sm">{addZero(card.number)} {card.name}</p>)}
          </div>
        </>
      })}
    </div>
  </div>
}