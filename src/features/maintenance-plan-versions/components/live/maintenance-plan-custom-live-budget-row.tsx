// 3rd party libraries
import classNames from 'classnames';
import React, { useId } from 'react';

// Workspace libraries
import { addDecimals } from '@project/shared/common/utils/add-decimals-truncated.util'
import { addThousandsSeparators } from '@project/shared/common/utils/add-thousands-separators.util'
import { IBudgetRow } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type';
import { TooltipBox } from '@project/ui';



interface BudgetRowProps {
  item: ParsedJson<IBudgetRow>;
  bgColor?: string;
  className?: string;
  labelClassName?: string;
  labelUnderline?: boolean;
}

const MaintenancePlanCustomLiveBudgetRow = (props: BudgetRowProps) => {
  // Create Input Values
  const [labelValue, setLabelValue] = React.useState('');
  const [yearExpenseValues, setYearExpenseValues] = React.useState([]);
  const id = useId();

  // useEffects
  React.useEffect(() => {
    setYearExpenseValues(
      props.item.expensesByYear.map((val) => {
        return {
          value: val,
        };
      })
    );
    setLabelValue(props.item.label);
  }, [props.item.expensesByYear, props.item.label]);

  return (
    <div
      className={classNames(
        `${props.bgColor} ${props.className} flex  border-t border-black/10`
      )}
    >
      <div className="w-[15%] flex">
        <p
          className={`${props.labelClassName} text-black text-sm font-normal py-1.5 pl-4 `}
          data-tooltip-id={`label-${id}`}
          data-tooltip-content={labelValue}
        >
          {labelValue}
        </p>
        <TooltipBox id={`label-${id}`} place="bottom" />
      </div>
      {/* Expenses By Year */}
      {yearExpenseValues.map((x, i) => (
        <>
          <p
            className={`${props.labelClassName} text-black py-1.5 border-l border-black/10 text-right text-sm font-normal flex-1 text-ellipsis whitespace-nowrap ml-2 overflow-hidden`}
            data-tooltip-id={`thousandsSeparators-${id}-${x.value}-${i}`}
            data-tooltip-content={addThousandsSeparators(addDecimals(x.value, 0)).toString()}
          >
            {addThousandsSeparators(addDecimals(x.value, 0))}
          </p>
          {x.value > 100000 && <TooltipBox id={`thousandsSeparators-${id}-${x.value}-${i}`} place="bottom" />}
        </>
      ))}
      <p
        className={`${props.labelClassName} text-right py-1.5 pr-4 border-l border-black/10 text-black text-sm font-medium text-ellipsis whitespace-nowrap flex-1 ml-2 overflow-hidden bg-black/5`}
        data-tooltip-id={`thousandsSeparators-${id}`}
        data-tooltip-content={addThousandsSeparators(
          addDecimals(props.item.totalExpenses, 0)
        ).toString()}
      >
        {/* Round off decimals and add thousands separators as periods (European notation) */}
        {addThousandsSeparators(addDecimals(props.item.totalExpenses, 0))}
      </p>
      {props.item.totalExpenses > 100000 && <TooltipBox id={`thousandsSeparators-${id}`} place="bottom" />}
    </div>
  );
};

MaintenancePlanCustomLiveBudgetRow.defaultProps = {
  bgColor: 'bg-mortar',
  labelUnderline: false,
  labelClassName: '',
  className: '',
};

export default MaintenancePlanCustomLiveBudgetRow;
