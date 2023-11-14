import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { inferPriorityLevel } from '@project/shared/feature-work-tasks/utils/infer-priority-level'
import { PriorityLevel } from '@project/shared/feature-work-tasks/enums/priority-level.enum'
import { UpdateWorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/update-work-task-dto.interface'
import { WorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/work-task.interface'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { usePathParamV2 } from '@project/ui';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import React, { FormEventHandler, useEffect, useId, useState } from 'react';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { Select } from '@thor-frontend/common/select/select';
import { useCraftsmanTypes } from '@thor-frontend/features/work-tasks/queries/craftsman-types';
import { useCurrentRealEstate } from '@thor-frontend/features/real-estates/hooks/use-current-real-estate';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { useUpdateWorkTask } from '@thor-frontend/features/work-tasks/queries/update-work-task';
import classNames from 'classnames';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { Checkbox } from '@thor-frontend/common/checkbox/checkbox';
import { TooltipBox } from '@project/ui';

export type IEditWorkTaskModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onRequestClose?: () => void;
  data: WorkTaskJSON;
};

/**
 * Component description
 */
export const EditWorkTaskModal: React.FC<IEditWorkTaskModalProps> = (props) => {
  const { data } = props;
  const id = useId();

  // worktask update
  const updateWorkTaskQuery = useUpdateWorkTask();

  // queries
  const craftsmanTypes = useCraftsmanTypes().data ?? [];
  const realEstate = useCurrentRealEstate();
  const [bdkId] = usePathParamV2('bdkId');
  const [disableButton, setDisableButton] = useState(true);

  //State
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [type, setType] = useState<WorkTaskType>(
    data.workTaskType ?? WorkTaskType.Maintenance
  );
  const [yearOfCompletion, setYearOfCompletion] = useState<number>(
    data.yearOfCompletion
  );
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(
    data.priorityLevel
  );
  const [amount, setAmount] = useState(data.amount);
  const [description, setDescription] = useState(data.description);
  const [unit, setUnit] = useState(data.unit);
  const [unitPrice, setUnitPrice] = useState(data.unitPrice);
  const [craftsmanTypeId, setCraftsmanTypeId] = useState(data.craftsmanTypeId);
  const [isIndexRegulated, setIsIndexRegulated] = useState(
    data.isIndexRegulated
  );
  const [requiresScaffolding, setRequiresScaffolding] = useState(
    data.requiresScaffolding
  );
  const [interval, setInterval] = useState<string>('0');
  const [notes, setNotes] = useState(data.notes);

  const indexRegulation = realEstate.data?.indexreg ?? 1;
  const totalPrice = getWorkTaskExpense(indexRegulation)({
    amount,
    isIndexRegulated,
    unitPrice,
  });

  const closeHandler = () => {
    props.onRequestClose();
  };

  const onYearInput: FormEventHandler<HTMLInputElement> = (e) => {
    const parsed = Number(e.currentTarget.value);

    if (isNaN(parsed)) {
      e.preventDefault();
      return;
    }

    const years = parsed - new Date().getFullYear();

    const _priorityLevel = inferPriorityLevel(years);

    if (priorityLevel !== _priorityLevel) {
      setPriorityLevel(_priorityLevel);
    }

    setYearOfCompletion(parsed);
  };

  const isLoading = () => updateWorkTaskQuery.isLoading;

  useEffect(() => {
    setDisableButton(
      data.description === description &&
      data.workTaskType === type &&
      data.yearOfCompletion === yearOfCompletion &&
      data.amount === amount &&
      data.unit === unit &&
      data.unitPrice === unitPrice &&
      data.craftsmanTypeId === craftsmanTypeId &&
      data.isIndexRegulated === isIndexRegulated &&
      data.notes === notes &&
      data.priorityLevel === priorityLevel &&
      data.requiresScaffolding === requiresScaffolding
    );
  }, [
    amount,
    description,
    unit,
    unitPrice,
    yearOfCompletion,
    craftsmanTypeId,
    isIndexRegulated,
    notes,
    priorityLevel,
    requiresScaffolding,
    type,
    data,
  ]);

  const submit = async () => {
    try {
      const updateWorkTaskData: UpdateWorkTaskJSON = {
        workTaskType: type,
        amount,
        description,
        unit,
        unitPrice,
        yearOfCompletion,
        craftsmanTypeId,
        isIndexRegulated,
        notes,
        priorityLevel,
        requiresScaffolding,
      };

      const dto = {
        realEstateCardId: bdkId,
        workTaskId: data._id,
        body: updateWorkTaskData,
      };
      await updateWorkTaskQuery.mutateAsync(dto);

      toast.success('Budgetpost redigeret!');

      props.setIsOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const intervalOptions = [
    { text: 'Ingen', value: '0' },
    { text: 'Hvert år', value: '1' },
    { text: 'Hvert 2. år', value: '2' },
    { text: 'Hvert 3. år', value: '3' },
    { text: 'Hvert 4. år', value: '4' },
  ];

  return (
    <Modal
      isOpen={props.isOpen}
      setIsOpen={closeHandler}
      topClassName="top-[75px]"
    >
      {/* header */}
      <ModalHeader title="Rediger budgetpost" onRequestClose={closeHandler} />

      <div
        className={classNames(' transition-all', {
          'h-[610px] overflow-y-scroll': showAdvancedSettings,
          'h-[320px] overflow-y-hidden': !showAdvancedSettings,
        })}
        style={{
          maxHeight: showAdvancedSettings ? 'calc(100vh - 300px)' : '320px',
        }}
      >
        {/* // Type */}
        <div className="flex flex-col gap-2 mb-5">
          <p className="text-sm mt-4 text-neutral-500 font-medium">Type</p>
          <Select
            activeClassName="bg-black/5"
            openTextColorClass="text-black"
            items={[
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="maintenance"
                    />
                    <p className="text-base font-medium">Vedligehold</p>
                  </div>
                ),
                value: 'maintenance',
              },
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="operating"
                    />
                    <p className="text-base font-medium">Drift</p>
                  </div>
                ),
                value: 'operating',
              },
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="improvement"
                    />
                    <p className="text-base font-medium">Forbedring</p>
                  </div>
                ),
                value: 'improvement',
              },
            ]}
            value={type}
            onChange={(x: WorkTaskType) => {
              console.log(x);
              setType(x);
            }}
          />
        </div>

        {/* udførselsår, beskrivelse */}
        <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">
          <InputWithLabel
            label={<p className="text-sm text-neutral-500">Udførselsår*</p>}
            inputProps={{
              value: yearOfCompletion,
              onInput: onYearInput,
            }}
          />

          <InputWithLabel
            className="gap-2 col-span-3"
            label={
              <p className="text-sm text-neutral-500">Kort beskrivelse*</p>
            }
            inputProps={{
              value: description,
              onInput: (e) => setDescription(e.currentTarget.value),
              onChange: (e) =>
                setDescription((e.target as HTMLInputElement).value),
            }}
          />
        </div>

        {/* amount, unit, unitprice, totalprice */}
        <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">
          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Antal*</p>}
            inputProps={{
              value: amount,
              onInput: (e) => setAmount(Number(e.currentTarget.value)),
              onChange: (e) =>
                setAmount(Number((e.target as HTMLInputElement).value)),
            }}
          />

          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Enhed*</p>}
            inputProps={{
              value: unit,
              onInput: (e) => setUnit(e.currentTarget.value),
            }}
          />

          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Enhedspris*</p>}
            inputProps={{
              value: unitPrice,
              onInput: (e) => setUnitPrice(Number(e.currentTarget.value)),
              onChange: (e) =>
                setUnitPrice(Number((e.target as HTMLInputElement).value)),
            }}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">Total pris*</p>
            <Amount
              className="py-2 px-4 bg-neutral-100 rounded-lg"
              amount={totalPrice}
            />
          </div>
        </div>
        {/* Divider */}
        <div
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="flex justify-between hover:cursor-pointer mb-5"
        >
          {showAdvancedSettings ? (
            <i className="ri-subtract-line text-2xl h-6 w-6 text-neutral-500 mr-1.5" />
          ) : (
            <i className="ri-add-line text-2xl h-6 w-6 text-neutral-500 mr-1.5" />
          )}
          <p className="text-neutral-500 mr-6 text-base mt-1 font-medium">
            Avanceret
          </p>
          <div className="flex-1 h-[1px] bg-slate mt-4" />
        </div>
        {/* Divider End */}

        {/* interval, håndværkerfag */}
        <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">
          <div className="flex flex-col gap-2 columns-2">
            <p className="text-sm text-neutral-500">Interval</p>
            <span
              data-tooltip-id={id}
              data-tooltip-content={'Kommer snart!'} >
              <Select
                items={[
                  {
                    display: '-',
                    value: null,
                  },
                ]}
                value={null}
                onChange={() => 0}
                disabled
              />
            </span>
            <TooltipBox id={id} place="bottom" />
          </div>

          <div className="flex flex-col gap-2 columns-2">
            <p className="text-sm text-neutral-500 font-medium">
              Håndværkerfag
            </p>
            <Select
              items={craftsmanTypes.map((x) => ({
                display: <p className="text-base font-medium">{x.name}</p>,
                value: x._id,
              }))}
              gutter={-120}
              value={craftsmanTypeId}
              onChange={(x) => setCraftsmanTypeId(x)}
            />
          </div>
        </div>

        {/* indeksregulering, kræver stillads */}
        <div className="flex mb-5">
          <div className="flex mr-8">
            <Checkbox
              styling={{
                uncheckedClassName: 'bg-white border-slate border-2',
                checkedClassName: 'bg-black',
              }}
              isChecked={isIndexRegulated}
              onChange={() => setIsIndexRegulated(!isIndexRegulated)}
            />
            <p className="ml-2 text-base mt-[1px] font-normal">
              Indeksregulering
            </p>
          </div>
          <div className="flex">
            <Checkbox
              styling={{
                uncheckedClassName: 'bg-white border-slate border-2',
                checkedClassName: 'bg-black',
              }}
              isChecked={requiresScaffolding}
              onChange={() => setRequiresScaffolding(!requiresScaffolding)}
            />
            <p className="ml-2 text-base mt-[1px] font-normal">
              Kræver stillads
            </p>
          </div>
        </div>

        {/* notes */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-500">Interne noter</p>
          <textarea
            className="px-4 py-2 outline-none focus:border-black w-full resize-none rounded-md border border-slate"
            rows={3}
            placeholder="Indtast noget her..."
            value={notes}
            onInput={(e) => setNotes(e.currentTarget.value)}
          ></textarea>
        </div>
      </div>

      {/* buttons */}
      <div className="grid grid-flow-col justify-end gap-2">
        <ModalTwoButtons
          cancelBtnText="Annuller"
          onRequestClose={closeHandler}
          cancelColor="secondary"
          cancelTextColor="text-neutral-700 "
          btnText="Gem ændringer"
          loading={isLoading()}
          disabled={disableButton}
          confirmHandler={submit}
        />
      </div>
    </Modal>
  );
};
