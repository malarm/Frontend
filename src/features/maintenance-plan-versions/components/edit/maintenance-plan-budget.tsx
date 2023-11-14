// 3rd party libraries
import React, { useEffect } from 'react';

// Workspace libraries
import { ICardBudgetRow } from '@project/shared/feature-real-estate-budgets/types/card-budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import { usePathParamV2 } from '@project/ui/hooks/use-path-param-v2';
import NoOverlaySpinnerV2 from '@project/ui/spinner/spinner-no-overlay-v2';
import MaintenancePlanBudgetRow from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-budget-row';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import MaintenancePlanCustomBudgetRow from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-custom-budget-row';
import MaintenancePlanTopNavigation from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-top-navigation';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useCreateCustomRow } from '@thor-frontend/features/real-estate-budgets/queries/custom-rows/create-custom-row';
import { useRealEstateBudgetById } from '@thor-frontend/features/real-estate-budgets/queries/real-estate-budget-by-id';
import EditMaintenancePlanTopBtns from '@thor-frontend/features/real-estates/components/edit-maintenance-plan-top-btns';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import MaintenancePlanHeader from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-edit-header';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';



const MaintenancePlanBudget = () => {
  // State
  const [loading, setLoading] = React.useState(false);

  // Hooks
  const [planId] = usePathParamV2('planId');
  const [id] = usePathParamV2('id');

  const planVersion = useMaintenancePlanVersionById(planId);
  const budgetQuery = useRealEstateBudgetById(
    planVersion.data?.realEstateBudgetId
  );

  React.useEffect(() => {
    budgetQuery.refetch();
  }, []);

  const createCustomRow = useCreateCustomRow();

  // Functions

  const createCustomRowHandler = async () => {
    setLoading(true);
    try {
      await createCustomRow.mutateAsync({
        realEstateBudgetId: planVersion.data?.realEstateBudgetId,
        dto: {
          label: '',
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
            labelUnderline
            isBDK
            bgColor={index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}
            item={cardRow}
          />
        );
      });

    const customRows = budget.customRows.map(
      (row: ParsedJson<ICardBudgetRow>, index: number) => {
        return (
          <MaintenancePlanCustomBudgetRow
            item={row}
            key={`budget-custom-row-${row._id}-${index}`}
          />
        );
      }
    );

    content = (
      <div>
        <MaintenancePlanHeader title="Budget" />
        <div className="mb-6" />
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

        {/* Button */}
        <div className="flex my-4 w-max">
          <i
            className="ri-add-line cursor-pointer text-neutral-500 text-2xl mr-1"
            onClick={createCustomRowHandler}
          />
          <p
            className="text-base mt-1 text-neutral-500 cursor-pointer font-medium"
            onClick={createCustomRowHandler}
          >
            Tilføj Budgetpost
          </p>
          {loading && (
            <div className="mt-2 ml-2">
              <NoOverlaySpinnerV2 size={14} />
            </div>
          )}
        </div>
        {/* Samlet Sum */}
        <MaintenancePlanBudgetRow
          bgColor="bg-mint"
          className="border-none"
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
    <RealEstateSubPage
      title="Vedligeholdelsesplan"
      topBarChildren={
        <>
          {/* Buttons */}
          <EditMaintenancePlanTopBtns
            stepsDto={{ isBudgetConfirmed: true }}
            nextBtnUrlPath={ThorSubPaths.MAINTENANCE_CONCLUSION}
            prevBtnUrlPath={ThorSubPaths.MAINTENANCE_BDK}
          />
        </>
      }
    >
      {/*  Content */}
      <MaintenancePlanContentWrapper>
        {content}
        {/* <code>{json}</code> */}
      </MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlanBudget;
