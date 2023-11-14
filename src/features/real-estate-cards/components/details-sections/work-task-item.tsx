// 3rd party libraries
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

// Workspace libraries
import toast from '@thor-frontend/common/utils/toast';
import { CreateCustomTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/create-custom-template.dto'
import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { ParsedJson } from '@project/shared/core/types/parsed-json.type'
import { UpdateWorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/update-work-task-dto.interface'
import { WorkTask } from '@project/shared/feature-work-tasks/interfaces/work-task.interface'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { DropdownMenuV2, SmallSpinnerV2, usePathParamV2, } from '@project/ui';
import { useConfirm } from '@project/ui/confirm';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import WorkTaskItemInput from '@thor-frontend/features/real-estate-cards/components/details-sections/work-task-item-input';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useCreateTemplate } from '@thor-frontend/features/templates/queries/create-template';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { useDeleteWorkTask } from '@thor-frontend/features/work-tasks/queries/delete-work-task';
import { useUpdateWorkTask } from '@thor-frontend/features/work-tasks/queries/update-work-task';



export enum InputTypes {
  description_input = 'description_input',
  amount_input = 'amount_input',
  unit_input = 'unit_input',
  year_of_completion_input = 'year_of_completion_input',
  unit_price_input = 'unit_price_input',
}

type Props = {
  workTask: ParsedJson<WorkTask>;
  setShowDeleteConfirm: (val: boolean) => void;
  setEditWorkTask: (val: ParsedJson<WorkTask>) => void;
  setEditModalIsOpen: (val: boolean) => void;
  setEditModeId: (val: string) => void;
  editModeId: string;
  index: number;
};

const WorkTaskItem = (props: Props) => {
  // Destruct Props
  const {
    workTask,
    setShowDeleteConfirm,
    setEditModalIsOpen,
    setEditWorkTask,
    editModeId,
    setEditModeId,
    index,
  } = props;

  // State
  const [idLoading, setIdLoading] = useState('');
  const [focusElement, setFocusElement] = useState('');

  // worktask update
  const updateWorkTaskQuery = useUpdateWorkTask();

  const [yearCompletionVal, setYearCompletionVal] = React.useState('');
  const [descriptionVal, setDescriptionVal] = React.useState('');
  const [amountVal, setAmountVal] = React.useState('');
  const [unitVal, setUnitVal] = React.useState('');
  const [unitPriceVal, setUnitPriceVal] = React.useState('');
  const [typeVal, setTypeVal] = React.useState<WorkTaskType>(
    WorkTaskType.Maintenance
  );

  // 1. Update ID when changing row
  // 2. Update when loose focus from all inputs. Same as line 1
  // 3. Update When pressing enter

  // Hooks
  const [bdkId] = usePathParamV2('bdkId');
  const confirm = useConfirm();
  const deleteWorkTaskQuery = useDeleteWorkTask();
  const user = useCurrentUser();
  const organizationId = useOrganizationId();
  const createTemplate = useCreateTemplate();
  const realEstateCard = useRealEstateCardById(bdkId);

  React.useEffect(() => {
    setYearCompletionVal(workTask.yearOfCompletion.toString());
    setDescriptionVal(workTask.description);
    setAmountVal(workTask.amount.toString());
    setUnitVal(workTask.unit);
    setUnitPriceVal(workTask.unitPrice.toString());
    setTypeVal(workTask.workTaskType);
  }, [workTask]);

  // Refs
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const yearOfCompletionRef = useRef<HTMLInputElement>(null);
  const unitPriceRef = useRef<HTMLInputElement>(null);

  // Functions
  const deleteWorkTask = async (
    realEstateCardId: string,
    workTaskId: string
  ) => {
    try {
      await deleteWorkTaskQuery.mutateAsync({
        realEstateCardId,
        workTaskId,
      });
      toast.success('Sådan! Din Budgetpost er blevet slettet!');
      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error(
        'Der opstod en uventet fejl. Din Budgetpost blev ikke slettet.'
      );
    }
  };

  const setEditModeHandler = (name: string) => {
    if (name === InputTypes.description_input) {
      descriptionRef.current.focus();
    } else if (name === InputTypes.amount_input) {
      amountRef.current.focus();
    } else if (name === InputTypes.unit_input) {
      unitRef.current.focus();
    } else if (name === InputTypes.year_of_completion_input) {
      yearOfCompletionRef.current.focus();
    } else if (name === InputTypes.unit_price_input) {
      unitPriceRef.current.focus();
    } else {
      // Update Here
      // setEditModeId('');
      // setFocusElement('');
    }
  };

  const onInputCapture = (item: React.FocusEvent, name: string) => {
    setEditModeId(workTask._id);
    setFocusElement(name);
  };

  const onInputBlur = async (e) => {
    setFocusElement('');
    setEditModeId('');

    await updateRow(e);
  };

  const updateRow = async (e = null) => {
    let shouldUpdate = false;
    try {
      if (!e) {
        console.log('Blur');
        descriptionRef.current.blur();
        amountRef.current.blur();
        unitRef.current.blur();
        yearOfCompletionRef.current.blur();
        unitPriceRef.current.blur();
        shouldUpdate = true;
      } else if (
        e.target.name === InputTypes.description_input &&
        descriptionVal !== workTask.description
      ) {
        shouldUpdate = true;
      } else if (
        e.target.name === InputTypes.amount_input &&
        Number(amountVal) !== workTask.amount
      ) {
        shouldUpdate = true;
      } else if (
        e.target.name === InputTypes.unit_input &&
        unitVal !== workTask.unit
      ) {
        shouldUpdate = true;
      } else if (
        e.target.name === InputTypes.year_of_completion_input &&
        Number(yearCompletionVal) !== workTask.yearOfCompletion
      ) {
        shouldUpdate = true;
      } else if (
        e.target.name === InputTypes.unit_price_input &&
        Number(unitPriceVal) !== workTask.unitPrice
      ) {
        shouldUpdate = true;
      }

      if (!shouldUpdate || idLoading) return;

      setIdLoading(workTask._id);
      const updateWorkTaskData: UpdateWorkTaskJSON = {
        // workTaskType: type,
        amount: Number(amountVal),
        description: descriptionVal,
        unit: unitVal,
        unitPrice: Number(unitPriceVal),
        yearOfCompletion: Number(yearCompletionVal),
      };

      const dto = {
        realEstateCardId: bdkId,
        workTaskId: workTask._id,
        body: updateWorkTaskData,
      };

      await updateWorkTaskQuery.mutateAsync(dto);
    } catch (err) {
      console.log(err);
    } finally {
      setIdLoading('');
    }
  };

  const isValidNumberRegex = (val: string): boolean => {
    if (!val) return true;
    const reg = new RegExp('^[0-9]+$');
    return reg.test(val);
  };

  const onKeyDown = async (e) => {
    // Enter / Return Key
    if (e.keyCode === 13) {
      await updateRow();
    }
  };

  const changeTypeHandler = async () => {
    let newTypeVal: WorkTaskType = WorkTaskType.Improvement;
    if (typeVal === WorkTaskType.Maintenance) {
      newTypeVal = WorkTaskType.Operating;
    } else if (typeVal === WorkTaskType.Operating) {
      newTypeVal = WorkTaskType.Improvement;
    } else if (typeVal === WorkTaskType.Improvement) {
      newTypeVal = WorkTaskType.Maintenance;
    }

    setTypeVal(newTypeVal);
    // Updatez
    try {
      setIdLoading(workTask._id);
      const updateWorkTaskData: UpdateWorkTaskJSON = {
        workTaskType: newTypeVal,
      };

      const dto = {
        realEstateCardId: bdkId,
        workTaskId: workTask._id,
        body: updateWorkTaskData,
      };

      await updateWorkTaskQuery.mutateAsync(dto);
    } catch (err) {
      console.log(err);
    } finally {
      setIdLoading('');
    }
  };

  // Return
  return (
    <tr
      className={classNames('border-t border-slate odd:bg-white flex-1', {
        'opacity-100': focusElement && editModeId,
        'opacity-25': !focusElement && editModeId,
      })}
    >
      {/* Year of Completion */}
      <WorkTaskItemInput
        onKeyDown={onKeyDown}
        ref={yearOfCompletionRef}
        placeholder="År"
        value={yearCompletionVal}
        inputType={InputTypes.year_of_completion_input}
        focusElement={focusElement}
        onInputBlur={onInputBlur}
        onInputCapture={onInputCapture}
        setEditModeHandler={setEditModeHandler}
        editMode={editModeId}
        onChange={(val) => {
          if (!isValidNumberRegex(val)) return;
          setYearCompletionVal(val);
        }}
      />
      <div className="flex flex-col justify-start mt-3">
        <td
          align="center"
          className="cursor-pointer"
          onClick={changeTypeHandler}
        >
          <WorkTaskTypeIcon workTaskType={typeVal} />
        </td>
      </div>

      {/* Description */}
      <WorkTaskItemInput
        onKeyDown={onKeyDown}
        ref={descriptionRef}
        placeholder="Beskrivelse"
        value={descriptionVal}
        inputType={InputTypes.description_input}
        focusElement={focusElement}
        onInputBlur={onInputBlur}
        onInputCapture={onInputCapture}
        setEditModeHandler={setEditModeHandler}
        editMode={editModeId}
        justifyContent="justify-start"
        inputTextAlignment="text-left"
        onChange={(val) => setDescriptionVal(val)}
        index={index}
      />
      {/* Amount */}
      <WorkTaskItemInput
        onKeyDown={onKeyDown}
        ref={amountRef}
        placeholder="Antal"
        value={amountVal}
        inputType={InputTypes.amount_input}
        focusElement={focusElement}
        onInputBlur={onInputBlur}
        onInputCapture={onInputCapture}
        setEditModeHandler={setEditModeHandler}
        editMode={editModeId}
        onChange={(val) => {
          if (!isValidNumberRegex(val)) return;
          setAmountVal(val);
        }}
      />
      {/* Unit */}
      <WorkTaskItemInput
        onKeyDown={onKeyDown}
        ref={unitRef}
        placeholder="Enhed"
        value={unitVal}
        inputType={InputTypes.unit_input}
        focusElement={focusElement}
        onInputBlur={onInputBlur}
        onInputCapture={onInputCapture}
        setEditModeHandler={setEditModeHandler}
        editMode={editModeId}
        onChange={(val) => setUnitVal(val)}
      />
      {/* Unit Price */}
      <WorkTaskItemInput
        onKeyDown={onKeyDown}
        ref={unitPriceRef}
        placeholder="Enh. Pris"
        value={unitPriceVal}
        inputType={InputTypes.unit_price_input}
        focusElement={focusElement}
        onInputBlur={onInputBlur}
        onInputCapture={onInputCapture}
        setEditModeHandler={setEditModeHandler}
        editMode={editModeId}
        onChange={(val) => {
          if (!isValidNumberRegex(val)) return;
          setUnitPriceVal(val);
        }}
        reactComponent={() => (
          <Amount amount={Number(unitPriceVal)} />
        )}
      />

      {/* Work Task Expense */}
      <td className="p-2 align-top" align="right">
        <Amount
          className="mt-1"
          amount={getWorkTaskExpense(1)(workTask)}
        />
      </td>

      <td className="py-2 align-top">
        {idLoading === workTask._id ? (
          <div className="h-8 w-8 pt-1.5">
            <SmallSpinnerV2 height="h-5" width="w-5" />
          </div>
        ) : (
          <DropdownMenuV2
            className="-mt-0.5"
            showRemixIcon
            align="right"
            items={[
              {
                title: 'Rediger',
                className: 'text-black',
                action: () => {
                  setEditModalIsOpen(true);
                  setEditWorkTask(workTask);
                },
              },
              {
                title: 'Gem som skabelon',
                className: 'text-black',
                action: async () => {
                  try {
                    setIdLoading(workTask._id);
                    // Save Work Task DTO
                    const data: CreateCustomTemplateDTOJSON = {
                      kind: 'work-task',
                      organizationId: organizationId,
                      creatingUser: {
                        userId: user.data._id,
                        username: user.data.username,
                        name: user.data.name,
                      },
                      standardCardId: realEstateCard.data.standardCardId,
                      workTaskContent: {
                        description: workTask.description,
                        amount: workTask.amount,
                        unit: workTask.unit,
                        unitPrice: workTask.unitPrice,
                        workTaskType: workTask.workTaskType,
                      },
                    };

                    await createTemplate.mutateAsync({
                      dto: data,
                    });

                    toast.success('Budgetpost skabelon gemt');
                  } catch (err) {
                    console.log(err);
                    toast.error(
                      'Noget gik galt. Skabelonen blev ikke gemt 🤔 Kontakt os hvis det fortsætter.'
                    );
                  } finally {
                    setIdLoading('');
                  }
                },
              },
              {
                title: 'Fjern',
                className: 'text-rose-500',
                action: async () => {
                  const wasConfirmed = await confirm({
                    title: 'Slet budgetpost',
                    body: 'Er du sikker på at du vil slette denne budgetpost? Handlingen kan ikke fortrydes.',
                    rightButtonColor: 'delete',
                  });

                  if (!wasConfirmed) {
                    return;
                  }
                  await deleteWorkTask(bdkId, workTask._id);
                },
              },
            ]}
          />
        )}
      </td>
    </tr>
  );
};

export default WorkTaskItem;
