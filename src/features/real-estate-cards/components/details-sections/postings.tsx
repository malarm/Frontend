// 3rd party libraries
import React, { forwardRef, RefObject, useId, useState } from 'react';
import classNames from 'classnames';

// Workspace libraries
import { Comparators } from '@project/shared/common/utils/comparators.util'
import { CreateCustomTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/create-custom-template.dto'
import { CreateWorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/create-work-task-dto.interface'
import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { inferPriorityLevel } from '@project/shared/feature-work-tasks/utils/infer-priority-level'
import { sort_v2 } from '@project/shared/common/utils/sort.util'
import { SuggestionJSON } from '@project/shared/feature-suggestions/types/suggestion.type'
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type'
import { WorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/work-task.interface'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import DropdownMenuV2 from '@project/ui/dropdown-menu/dropdown-menu.v2';
import { usePathParamV2 } from '@project/ui/hooks/use-path-param-v2';
import { AddTemplateButton } from '@thor-frontend/common/add-template-button/add-template-button';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { useBDKSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { Priority } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/priority';
import { CreateWorkTaskModal } from '@thor-frontend/features/real-estate-cards/modals/create-work-task-modal';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useCurrentRealEstate } from '@thor-frontend/features/real-estates/hooks/use-current-real-estate';
import { SmallSpinnerV2 } from '@project/ui';
import { useSuggestions } from '@thor-frontend/features/suggestions/queries/suggestions';
import { useCreateWorkTask } from '@thor-frontend/features/work-tasks/queries/create-work-task';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';
import { useDeleteWorkTask } from '@thor-frontend/features/work-tasks/queries/delete-work-task';
import { WorkTaskTemplatesModal } from '@thor-frontend/features/real-estate-cards/modals/work-task-templates-modal';
import { useCraftsmanTypes } from '@thor-frontend/features/work-tasks/queries/craftsman-types';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id';
import { useCreateTemplate } from '@thor-frontend/features/templates/queries/create-template';
import { useConfirm } from '@project/ui/confirm';
import WorkTaskItem from '@thor-frontend/features/real-estate-cards/components/details-sections/work-task-item';
import { TooltipBox } from '@project/ui';



/**
 * The "Budgetposter" section of the real estate card details view
 */

export const Postings = () => {
  const [bdkId] = usePathParamV2('bdkId');
  const [editModeId, setEditModeId] = useState('');
  const realEstate = useCurrentRealEstate();
  const craftsmanTypes = useCraftsmanTypes().data ?? [];
  const createWorkTaskQuery = useCreateWorkTask();
  const deleteWorkTaskQuery = useDeleteWorkTask();
  const user = useCurrentUser();
  const organizationId = useOrganizationId();
  const createTemplate = useCreateTemplate();
  const confirm = useConfirm();

  const indexRegulation = realEstate.data?.indexreg ?? 1;

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [templateModalIsOpen, setTemplateModalIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteWorkTaskId, setDeleteWorkTaskId] = useState('');
  const [editWorkTask, setEditWorkTask] = useState<WorkTaskJSON>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const id = useId();

  const realEstateCard = useRealEstateCardById(bdkId);
  const defaultCraftsman =
    craftsmanTypes.find((x) => /andet/i.test(x.name)) ?? craftsmanTypes[0];

  const workTasks = sort_v2(
    realEstateCard.data?.workTasks ?? [],
    (x) => x.yearOfCompletion,
    Comparators.Number.Ascending
  );

  const workTaskSuggestionsQuery = useSuggestions({
    realEstateId: realEstate.data?._id,
    kind: 'work-task',
    standardCardId: realEstateCard.data?.standardCardId,
  });

  const workTaskSuggestions = workTaskSuggestionsQuery.data ?? [];

  const onTemplateSelected = async (template: TemplateJSON) => {
    setTemplateModalIsOpen(false);
    try {
      const dto: CreateWorkTaskJSON = {
        amount: template.workTaskContent.amount,
        description: template.workTaskContent.description,
        realEstateCardId: bdkId,
        unit: template.workTaskContent.unit,
        unitPrice: template.workTaskContent.unitPrice,
        yearOfCompletion: new Date().getFullYear(),
        craftsmanTypeId: defaultCraftsman._id,
        isIndexRegulated: true,
        notes: '',
        priorityLevel: inferPriorityLevel(0),
        requiresScaffolding: false,
        workTaskType:
          template.workTaskContent.workTaskType ?? WorkTaskType.Maintenance,
      };
      await createWorkTaskQuery.mutateAsync(dto);
      toast.success('Budgetpost oprettet!');
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    }
  };

  const tableContent = () => {
    if (workTasks.length === 0) {
      return (
        <p className="text-neutral-500 italic">
          Der er endnu ikke oprettet nogen budgetposter
        </p>
      );
    }

    const totalExpenses = workTasks
      .map((workTask) => getWorkTaskExpense(indexRegulation)(workTask))
      .reduce((a, b) => a + b, 0);

    return (
      <table className="w-full">
        <colgroup>
          {/* år */}
          <col className="w-[55px]" />

          {/* kategori */}
          <col className="w-[10px]" />

          {/* beskrivelse */}
          <col className="w-[40%]" />

          {/* antal */}
          <col className="w-[6%]" />

          {/* enhed */}
          <col className="w-[55px]" />

          {/* enhedspris */}
          <col className="min-w-[150px]" />

          {/* total pris */}
          <col className="w-[150px]" />

          {/* menu */}
          <col className="w-[30px]" />
        </colgroup>
        <thead>
          <tr className="text-sm text-neutral-500">
            <th className="px-1 py-4 w-max font-medium">År</th>
            <th className="px-1 py-4 w-max font-medium" align="center">
              Type
            </th>
            <th className="px-1 py-4 font-medium" align="left">
              Beskrivelse
            </th>
            <th className="px-1 py-4 font-medium" align="right">
              Antal
            </th>
            <th className="px-1 py-4 font-medium" align="right">
              Enhed
            </th>
            <th className="px-1 py-4 font-medium" align="right">
              Enh. Pris
            </th>
            <th className="px-1 py-4 font-medium" align="right">
              Pris i alt
            </th>
            <th />
          </tr>
        </thead>

        <tbody>
          {/* // Work Tasks */}
          {workTasks.map((workTask, index: number) => {
            return (
              <WorkTaskItem
                key={workTask._id}
                workTask={workTask}
                setShowDeleteConfirm={setShowDeleteConfirm}
                setEditWorkTask={setEditWorkTask}
                setEditModalIsOpen={setEditModalIsOpen}
                setEditModeId={setEditModeId}
                editModeId={editModeId}
                index={index}
              />
            );
          })}
          <tr className="bg-pine ">
            <td className="pl-4 text-white font-medium" colSpan={6}>
              Total udgift
            </td>
            <td className="p-2" align="right">
              <Amount
                className="text-white font-medium"
                amount={totalExpenses}
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div

      className="pb-8 border-b border-slate"
    >
      <h2 className="text-xl mt-8 text-black mb-6">4. Budgetposter</h2>

      <div className="mb-6 flex flex-row gap-2">
        <UpsiteButton onClick={() => setCreateModalIsOpen(true)} type="secondary"><i className="text-xl ri-add-line" /> Tilføj ny</UpsiteButton>

        <div className="relative group">
          <AddTemplateButton onClick={() => setTemplateModalIsOpen(true)} />

          {workTaskSuggestions.length > 0 ? (
            <>
              <span
                data-tooltip-id={id}
                data-tooltip-content={`${workTaskSuggestions.length} Upsi±eAI forslag`}
              >
                <div
                  style={{
                    bottom: 'calc(100% - 16px)',
                    left: 'calc(100% - 16px)',
                  }}
                  className={classNames(
                    'absolute bg-purple rounded-full grid grid-flow-col'
                  )}
                >
                  <span className="grid text-lg w-6 h-6 place-content-center">
                    ±
                  </span>
                </div>
              </span>
              <TooltipBox id={id} place="bottom" />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      {tableContent()}

      {createModalIsOpen && (
        <CreateWorkTaskModal
          isOpen={createModalIsOpen}
          setIsOpen={setCreateModalIsOpen}
        />
      )}
      {editModalIsOpen && (
        <CreateWorkTaskModal
          isOpen={editModalIsOpen}
          setIsOpen={setEditModalIsOpen}
          data={editWorkTask}
          onRequestClose={() => {
            setEditModalIsOpen(false);
            setEditWorkTask(null);
          }}
        />
      )}

      <WorkTaskTemplatesModal
        isOpen={templateModalIsOpen}
        setIsOpen={setTemplateModalIsOpen}
        standardCardId={realEstateCard.data?.standardCardId}
        onTemplateSelected={onTemplateSelected}
      />
    </div>
  );
}

