// 3rd party libraries
import classNames from 'classnames';
import { useId } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { addDecimals } from '@project/shared/common/utils/add-decimals-truncated.util'
import { addThousandsSeparators } from '@project/shared/common/utils/add-thousands-separators.util'
import { IBudgetRow } from '@project/shared/feature-real-estate-budgets/types/budget-row.type'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type';
import { usePathParamV2 } from '@project/ui';
import { TooltipBox } from '@project/ui';



interface BudgetRowProps {
  item: ParsedJson<IBudgetRow>;
  bgColor?: string;
  className?: string;
  labelClassName?: string;
  labelUnderline?: boolean;
  isBDK?: boolean;
}

const MaintenancePlanBudgetRow = (props: BudgetRowProps) => {
  // Hooks
  const [planId] = usePathParamV2('planId');
  const history = useHistory();
  const id = useId();

  return (
    <div
      className={classNames(
        `${props.bgColor} ${props.className} flex  border-t border-black/10`
      )}
    >
      <p
        onClick={() => {
          if (!props.isBDK || !props.item.realEstateCardId) return;
          const route = history.location.pathname
            .split('/')
            .slice(0, -1)
            .join('/');

          history.push(`${route}/bdk/${props.item.realEstateCardId}`);
        }}
        className={classNames(
          `${props.labelClassName} ${props.labelUnderline && 'underline'
          } text-black text-sm w-[15%] font-medium text-ellipsis overflow-hidden whitespace-nowrap py-1.5 pl-4`,
          { 'hover:cursor-pointer': props.isBDK }
        )}
        data-tooltip-id={`label-${id}`}
        data-tooltip-content={props.item.label}
      >
        {props.item.label}
      </p>
      <TooltipBox id={`label-${id}`} place="bottom" />
      {props.item.expensesByYear.map((x, i) => (
        <>
          <p
            className={`${props.labelClassName} text-black py-1.5 border-l border-black/10 inline-block text-right text-sm font-normal flex-1 text-ellipsis whitespace-nowrap ml-2 overflow-hidden`}
            data-tooltip-id={`thousandsSeparators-${id}-${x}-${i}`}
            data-tooltip-content={addThousandsSeparators(addDecimals(x, 0)).toString()}
          >
            {addThousandsSeparators(addDecimals(x, 0))}
          </p>
          {x > 100000 && <TooltipBox id={`thousandsSeparators-${id}-${x}-${i}`} place="bottom" />}

        </>

      ))}
      <p
        className={`${props.labelClassName} text-right py-1.5 pr-4 border-l border-black/10 text-black text-sm font-normal text-ellipsis whitespace-nowrap flex-1 ml-2 overflow-hidden bg-black/5`}
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

MaintenancePlanBudgetRow.defaultProps = {
  bgColor: 'bg-white',
  labelUnderline: false,
  isBDK: false,
  labelClassName: '',
  className: '',
};

export default MaintenancePlanBudgetRow;
