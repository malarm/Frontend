// 3rd party libraries
import React, { Dispatch, FormEventHandler, SetStateAction, useEffect, useId, useState, } from 'react';
import classNames from 'classnames';

// Workspace libraries
import { CreateWorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/create-work-task-dto.interface'
import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { inferPriorityLevel } from '@project/shared/feature-work-tasks/utils/infer-priority-level'
import { PriorityLevel } from '@project/shared/feature-work-tasks/enums/priority-level.enum'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { usePathParamV2 } from '@project/ui';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { Select } from '@thor-frontend/common/select/select';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { useCraftsmanTypes } from '@thor-frontend/features/work-tasks/queries/craftsman-types';
import { useCurrentRealEstate } from '@thor-frontend/features/real-estates/hooks/use-current-real-estate';
import { useCreateWorkTask } from '@thor-frontend/features/work-tasks/queries/create-work-task';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';
import { useConfirm } from '@project/ui/confirm';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { Checkbox } from '@thor-frontend/common/checkbox/checkbox';
import { UpdateWorkTaskJSON, WorkTaskJSON } from '@project/shared/feature-work-tasks';
import { useUpdateWorkTask } from '@thor-frontend/features/work-tasks/queries/update-work-task';



export type ICreateWorkTaskModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onRequestClose?: () => void;
  data?: WorkTaskJSON;
};

/**
 * returns a handler for an ``<input>`` event (such as "onInput") which
 * calls the setter, only if the
 *
 *
 * @param setter
 * @returns
 */
const setIfNumber =
  (
    setter: Dispatch<SetStateAction<number>>
  ): FormEventHandler<HTMLInputElement> =>
    (event) => {
      const parsed = Number(event.currentTarget.value);

      if (isNaN(parsed)) {
        event.preventDefault();
        return;
      }

      setter(parsed);
    };

/**
 * Component description
 */
export const CreateWorkTaskModal: React.FC<ICreateWorkTaskModalProps> = (
  props
) => {

  const { data } = props;
  const id = useId();

  // hooks/queries
  const realEstate = useCurrentRealEstate();
  const [realEstateCardId] = usePathParamV2('bdkId');
  const craftsmanTypes = useCraftsmanTypes().data ?? [];
  const createWorkTaskQuery = useCreateWorkTask();
  const confirm = useConfirm();

  // worktask update
  const updateWorkTaskQuery = useUpdateWorkTask();

  // state
  const [formWasChanged, setFormWasChanged] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const [type, setType] = useState<WorkTaskType>('maintenance');
  const [yearOfCompletion, setYearOfCompletion] = useState(
    new Date().getFullYear()
  );
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [craftsmanTypeId, setCraftsmanTypeId] = useState('');
  const [isIndexRegulated, setIsIndexRegulated] = useState(true);
  const [requiresScaffolding, setRequiresScaffolding] = useState(false);
  const [interval, setInterval] = useState<string>('0');
  const [notes, setNotes] = useState('');

  // derived state
  const indexRegulation = realEstate.data?.indexreg ?? 1;
  const defaultCraftsmanId = craftsmanTypes.find((x) => /andet/i.test(x.name));
  const totalPrice = getWorkTaskExpense(indexRegulation)({
    amount,
    isIndexRegulated,
    unitPrice,
  });


  useEffect(() => {
    setInputData();
  }, [data])

  const setInputData = () => {
    if (data) {
      setType(data.workTaskType ?? WorkTaskType.Maintenance);
      setYearOfCompletion(data.yearOfCompletion);
      setPriorityLevel(data.priorityLevel);
      setAmount(data.amount);
      setDescription(data.description);
      setUnit(data.unit);
      setUnitPrice(data.unitPrice);
      setCraftsmanTypeId(data.craftsmanTypeId);
      setIsIndexRegulated(data.isIndexRegulated);
      setRequiresScaffolding(data.requiresScaffolding);
      setInterval('0');
      setNotes(data.notes);
    }
  }

  // set default craftsmantype id value
  useEffect(() => {
    if (!data && defaultCraftsmanId && craftsmanTypeId === '') {
      setCraftsmanTypeId(defaultCraftsmanId._id);
    }
  }, [craftsmanTypeId, defaultCraftsmanId, data]);

  /**
   * Reset all input fields to their default values
   */
  const reset = () => {
    setFormWasChanged(false);
    setType('maintenance');
    setYearOfCompletion(new Date().getFullYear());
    setPriorityLevel(0);
    setAmount(0);
    setDescription('');
    setUnit('');
    setUnitPrice(0);
    setCraftsmanTypeId('');
    setIsIndexRegulated(false);
    setRequiresScaffolding(false);
    setNotes('');
    setInterval('0');
    if (data) {
      setInputData();
    }
  };

  /**
   * Handler for the year input event
   *
   * Sets priority level based on the new year value
   */
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

  /**
   * Returns true if the form is valid (roughly speaking...
   * backend does additional validation)
   */

  useEffect(() => {
    if (data) {
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
        data.requiresScaffolding === requiresScaffolding &&
        interval === '0'
      );
    } else {
      setDisableButton(!(description.length > 0 && unit.length > 0))
    }
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
    interval,
    data,
  ]);

  const isLoading = () => createWorkTaskQuery.isLoading || updateWorkTaskQuery.isLoading;

  const submit = async () => {
    if (data) {
      await updateWorkTask();
    } else {
      await createWorkTask();
    }
  }

  const createWorkTask = async () => {
    try {
      const years: number[] = [];
      const currentYear = new Date().getFullYear();
      let tempYearOfSelection = yearOfCompletion;
      const intervalValue = Number(interval);
      if (intervalValue > 0) {
        while (tempYearOfSelection <= currentYear + 9) {
          years.push(tempYearOfSelection);
          tempYearOfSelection = tempYearOfSelection + intervalValue;
        }
      } else {
        years.push(yearOfCompletion);
      }
      await Promise.all(
        years.map((year) =>
          createWorkTaskQuery.mutateAsync({
            amount,
            description,
            realEstateCardId,
            unit,
            unitPrice,
            yearOfCompletion: year,
            craftsmanTypeId,
            isIndexRegulated,
            notes,
            priorityLevel,
            requiresScaffolding,
            workTaskType: type,
          })
        )
      );

      toast.success('Budgetpost oprettet!');

      props.setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };


  const updateWorkTask = async () => {
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
        realEstateCardId: realEstateCardId,
        workTaskId: data._id,
        body: updateWorkTaskData,
      };
      await updateWorkTaskQuery.mutateAsync(dto);

      await createFutureYearsInUpdate();

      toast.success('Budgetpost redigeret!');

      props.setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const createFutureYearsInUpdate = async () => {
    try {
      const years: number[] = [];
      const currentYear = new Date().getFullYear();
      let tempYearOfSelection = yearOfCompletion;
      const intervalValue = Number(interval);
      if (intervalValue > 0) {
        while (tempYearOfSelection <= currentYear + 9) {
          if (yearOfCompletion != tempYearOfSelection)
            years.push(tempYearOfSelection);
          tempYearOfSelection = tempYearOfSelection + intervalValue;
        }
      }

      if (years.length > 0)
        await Promise.all(
          years.map((year) =>
            createWorkTaskQuery.mutateAsync({
              amount,
              description,
              realEstateCardId,
              unit,
              unitPrice,
              yearOfCompletion: year,
              craftsmanTypeId,
              isIndexRegulated,
              notes,
              priorityLevel,
              requiresScaffolding,
              workTaskType: type,
            })
          )
        );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const cancel = async () => {
    // confirm
    if (formWasChanged) {
      const isConfirmed = await confirm({
        title: 'Luk vindue?',
        body: 'Din nye budgetpost gemmes ikke',
        rightButtonColor: 'neutral',
      });

      if (!isConfirmed) return;
    }

    reset();
    props.setIsOpen(false);
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
      setIsOpen={cancel}
      topClassName="top-[75px]"
      widthClassName="w-[750px]"
    >
      <div onInput={(e) => setFormWasChanged(true)}>
        {/* header */}
        <ModalHeader
          title={data ? "Rediger budgetpost" : "Tilføj budgetpost"}
          onRequestClose={() => cancel()}
        />
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
              label={
                <p className="text-sm text-neutral-500 font-medium">
                  Udførselsår*
                </p>
              }
              inputProps={{
                value: yearOfCompletion,
                onInput: onYearInput,
              }}
            />

            <InputWithLabel
              className="gap-2 col-span-3"
              label={
                <p className="text-sm text-neutral-500 font-medium">
                  Kort beskrivelse*
                </p>
              }
              inputProps={{
                value: description,
                onInput: (e) => setDescription(e.currentTarget.value),
              }}
            />
          </div>
          {/* amount, unit, unitprice, totalprice */}
          <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">
            <InputWithLabel
              className="gap-2"
              label={
                <p className="text-sm text-neutral-500 font-medium">Antal*</p>
              }
              inputProps={{
                onInput: setIfNumber(setAmount),
                value: amount,
              }}
            />

            <InputWithLabel
              className="gap-2"
              label={
                <p className="text-sm text-neutral-500 font-medium">Enhed*</p>
              }
              inputProps={{
                value: unit,
                onInput: (e) => setUnit(e.currentTarget.value),
              }}
            />

            <InputWithLabel
              className="gap-2"
              label={
                <p className="text-sm text-neutral-500 font-medium">
                  Enhedspris*
                </p>
              }
              inputProps={{
                onInput: setIfNumber(setUnitPrice),
                value: unitPrice,
              }}
            />

            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-500 font-medium">Pris i alt</p>
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
              <p className="text-sm text-neutral-500 font-medium">Interval</p>

              <Select
                items={intervalOptions.map((x) => ({
                  display: <p className="text-base font-medium">{x.text}</p>,
                  value: x.value,
                }))}
                value={interval}
                onChange={(x) => setInterval(x)}
                gutter={-120}
              />
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
          <div className="flex flex-col gap-2 mb-5">
            <p className="text-sm text-neutral-500 font-medium">
              Interne noter
            </p>
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
        <div className="grid grid-flow-col justify-end gap-2 mt-5">
          <UpsiteButton type="secondary" onClick={cancel}>Annuler</UpsiteButton>
          <UpsiteButton isDisabled={disableButton} onClick={submit} isLoading={isLoading()}>{data ? "Gem ændringer" : "Tilføj"}</UpsiteButton>
        </div>
      </div>
    </Modal>
  );
};
