// 3rd party libraries
import React from 'react';

// Workspace libraries
import { IBudgetRow } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type';
import { usePathParamV2 } from '@project/ui';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useUpdateCustomRowExpense } from '@thor-frontend/features/real-estate-budgets/queries/custom-rows/update-custom-row-expense';



interface BudgetRowProps {
  item: ParsedJson<IBudgetRow>;
  setLoading: (value: boolean) => void;
  index: number;
  value: string;
}

const MaintenancePlanCustomBudgetRowInput = (props: BudgetRowProps) => {
  // const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);

  // Hooks
  const [planId] = usePathParamV2('planId');
  const planVersion = useMaintenancePlanVersionById(planId);
  const updateCustomRowExpense = useUpdateCustomRowExpense();
  // useEffects

  React.useEffect(() => {
    setValue(Number(props.value));
  }, []);

  // Functions

  const debouncedOnExpenseChange = useDebouncedFunction(
    1000,
    async (updatedValue: string, expenseYear: number, customRowId: string) => {
      await updateCustomRowExpense.mutateAsync({
        realEstateBudgetId: planVersion.data?.realEstateBudgetId,
        customRowId: customRowId,
        dto: {
          year: expenseYear,
          amount: Number(updatedValue),
        },
      });
      props.setLoading(false);
    }
  );

  const yearExpenseHandler = (value: string, index: number) => {
    if (!value) value = '0';
    if (containsLetters(value)) return;
    props.setLoading(true);
    setValue(Number(value));
    debouncedOnExpenseChange(
      value,
      props.item.startYear + index,
      props.item._id.toString()
    );
  };

  const containsLetters = (str: string) => {
    const regex = /^\d+$/;
    return !regex.test(str);
  };

  return (
    <div className="flex-1 ml-2 py-1.5 border-l border-black/10 pl-1">
      <input
        className="pl-2 pr-1 text-black rounded text-sm w-full font-medium text-right"
        value={value}
        onChange={(e) => yearExpenseHandler(e.target.value, props.index)}
      />
    </div>
  );
};

export default MaintenancePlanCustomBudgetRowInput;
