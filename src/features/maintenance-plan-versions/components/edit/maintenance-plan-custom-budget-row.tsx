// 3rd party libraries
import classNames from 'classnames';
import React, { useId } from 'react';

// Workspace libraries
import { getErrorMessage } from '@project/ui/get-error-message'
import { addThousandsSeparators } from '@project/shared/common/utils/add-thousands-separators.util'
import { IBudgetRow } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type';
import { usePathParamV2 } from '@project/ui';
import { useConfirm } from '@project/ui/confirm';
import NoOverlaySpinnerV2 from '@project/ui/spinner/spinner-no-overlay-v2';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import toast from '@thor-frontend/common/utils/toast';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useDeleteCustomRow } from '@thor-frontend/features/real-estate-budgets/queries/custom-rows/delete-custom-row';
import { useUpdateCustomRow } from '@thor-frontend/features/real-estate-budgets/queries/custom-rows/update-custom-row';
import MaintenancePlanCustomBudgetRowInput from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-custom-budget-row-input';
import { TooltipBox } from '@project/ui';



interface BudgetRowProps {
  item: ParsedJson<IBudgetRow>;
  bgColor?: string;
  className?: string;
  labelClassName?: string;
  labelUnderline?: boolean;
}

const MaintenancePlanCustomBudgetRow = (props: BudgetRowProps) => {
  // Create Input Values
  const [labelValue, setLabelValue] = React.useState('');
  const [yearExpenseValues, setYearExpenseValues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Hooks
  const [planId] = usePathParamV2('planId');
  const planVersion = useMaintenancePlanVersionById(planId);
  const updateCustomRow = useUpdateCustomRow();
  const deleteCustomRow = useDeleteCustomRow();
  const confirm = useConfirm();
  const id = useId();

  // useEffects

  React.useEffect(() => {
    setYearExpenseValues(
      props.item.expensesByYear.map((val, i) => {
        return {
          id: `input-${i}-budget-row-${props.item._id}`,
          value: val,
        };
      })
    );
    setLabelValue(props.item.label);
  }, [props.item.expensesByYear]);

  // Functions

  const deleteCustomBudgetRow = async (customRowId: string) => {
    try {
      const wasConfirmed = await confirm({
        title: 'Slet budgetpost',
        body: 'Budgetposten bliver fjernet fra 10-års budgettet.',
        rightButtonColor: 'delete',
      });

      if (!wasConfirmed) return;

      setLoading(true);
      // Delete Mutation
      await deleteCustomRow.mutateAsync({
        realEstateBudgetId: planVersion.data?.realEstateBudgetId,
        customRowId: customRowId,
      });
      setLoading(false);

      toast.success('Budgetposten er blevet slettet 👍');
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err));
    }
  };

  const debouncedOnLabelChange = useDebouncedFunction(
    1000,
    async (updatedValue: string, customRowId: string) => {
      await updateCustomRow.mutateAsync({
        realEstateBudgetId: planVersion.data?.realEstateBudgetId,
        customRowId: customRowId,
        dto: {
          label: updatedValue,
        },
      });
      setLoading(false);
    }
  );

  const labelHandler = (value: string) => {
    setLoading(true);
    setLabelValue(value);
    debouncedOnLabelChange(value, props.item._id.toString());
  };

  return (
    <div
      className={classNames(
        `${props.bgColor} ${props.className} flex border-t border-black/10`
      )}
    >
      <div className="w-[15%] flex py-1.5 pl-4">
        <input
          className="px-2 text-black text-sm font-medium rounded w-[90%]"
          onChange={(e) => labelHandler(e.target.value)}
          value={labelValue}
          placeholder="Tilføj en titel.."
        />
        {/* Delete a Custom Budget Row */}
        <i
          onClick={() => deleteCustomBudgetRow(props.item._id.toString())}
          className="ri-delete-bin-line text-black opacity-50 hover:opacity-100 cursor-pointer ml-2"
        />
        {loading && (
          <div className="mt-1 ml-2">
            <NoOverlaySpinnerV2 size={14} />
          </div>
        )}
      </div>
      {/* Expenses By Year */}
      {yearExpenseValues.map((x, i) => (
        <MaintenancePlanCustomBudgetRowInput
          key={x.id}
          value={yearExpenseValues[i].value}
          item={props.item}
          index={i}
          setLoading={setLoading}
        />
      ))}
      <p
        className={`${props.labelClassName} text-black py-1.5 pr-4 border-l border-black/10 text-sm ml-2 font-medium text-ellipsis whitespace-nowrap flex-1 text-right overflow-hidden bg-black/5`}
        data-tooltip-id={id}
        data-tooltip-content={addThousandsSeparators(props.item.totalExpenses).toString()}
      >
        {addThousandsSeparators(props.item.totalExpenses)}
      </p>
      <TooltipBox id={id} place="bottom" />
    </div>
  );
};

MaintenancePlanCustomBudgetRow.defaultProps = {
  bgColor: 'bg-mortar',
  labelUnderline: false,
  labelClassName: '',
  className: '',
};

export default MaintenancePlanCustomBudgetRow;
