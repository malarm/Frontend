// 3rd party libraries
import React from 'react';

// Workspace libraries
import { ICardBudgetRow } from '@project/shared/feature-real-estate-budgets/types/card-budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type';
import { usePathParamV2 } from '@project/ui';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import MaintenancePlanBudgetRow from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-budget-row';
import MaintenancePlanCustomLiveBudgetRow from '@thor-frontend/features/maintenance-plan-versions/components/live/maintenance-plan-custom-live-budget-row';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useRealEstateBudgetById } from '@thor-frontend/features/real-estate-budgets/queries/real-estate-budget-by-id';



export type IMaintenancePlanLiveBudgetProps = {
  //
};

/**
 * Component description
 */
export const MaintenancePlanLiveBudget: React.FC<
  IMaintenancePlanLiveBudgetProps
> = (props) => {
  // Hooks
  const [planId] = usePathParamV2('planId');
  const planVersion = useMaintenancePlanVersionById(planId);
  const budgetQuery = useRealEstateBudgetById(
    planVersion.data?.realEstateBudgetId
  );

  // Content

  let content = (
    <div className="flex justify-center mt-12">
      <UpsiteLogoLoader />
    </div>
  );

  if (budgetQuery.data) {
    const budget = budgetQuery?.data?.value;

    const yearsToOutput = [];

    for (let index = 0; index < 10; index++) {
      yearsToOutput.push(budget.startYear + index);
    }

    // Loop Years
    const yearsOutput = yearsToOutput.map((x: number) => (
      <p
        key={`year-output-${x}`}
        className="text-neutral-500 text-sm font-medium flex-1 text-right"
      >
        {x}
      </p>
    ));

    const cardRows = budget.cardRows
      // Quick Simple Sort
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((cardRow: ParsedJson<ICardBudgetRow>, index: number) => {
        return (
          <MaintenancePlanBudgetRow
            key={`budget-row-${cardRow.label}-${index}`}
            labelUnderline={false}
            isBDK={false}
            bgColor={index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}
            item={cardRow}
          />
        );
      });

    const customRows = budget.customRows.map(
      (row: ParsedJson<ICardBudgetRow>, index: number) => {
        return (
          <MaintenancePlanCustomLiveBudgetRow
            item={row}
            key={`budget-custom-row-${row.label}-${index}`}
          />
        );
      }
    );

    content = (
      <div>
        {/* Header */}
        <div className="flex px-4 pb-2">
          <p className="text-neutral-500 text-sm font-medium w-[15%]">
            Bygningsdelskort
          </p>
          {yearsOutput}
          <p className="text-neutral-500 text-sm font-medium flex-1 text-right">
            I alt
          </p>
        </div>
        {/* Content */}
        {cardRows}
        {/* Cards Total */}
        <MaintenancePlanBudgetRow
          bgColor="bg-slate"
          className="mb-4"
          item={budget.cardsTotalRow}
        />

        {/* Custom Budget Rows */}
        {customRows}

        {/* Samlet Sum */}
        <MaintenancePlanBudgetRow
          bgColor="bg-mint"
          className="border-none mt-4"
          item={budget.totalExMomsRow}
        />
        {/* Samlet Sum Inkl Moms*/}
        <MaintenancePlanBudgetRow
          bgColor="bg-pine"
          labelClassName="text-white"
          className="mb-4 border-none"
          item={budget.totalInclMomsRow}
        />
        {/* Samlet Area sum*/}
        <MaintenancePlanBudgetRow
          item={budget.totalOverAreaRow}
          bgColor="bg-slate"
        />

        <div className="mt-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-black mb-6">Budget</h1>
      {/*  Content */}

      {content}
    </div>
  );
};
