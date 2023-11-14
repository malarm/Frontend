// 3rd party libraries
import React, { useId, useState } from 'react';

// Workspace libraries
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type'
import { WorkTaskJSON } from '@project/shared/feature-work-tasks/interfaces/work-task.interface'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { DropdownMenuV2, SmallSpinnerV2, } from '@project/ui';
import { SideView } from '@thor-frontend/common/sideview/sideview.component';
import toast from '@thor-frontend/common/utils/toast';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { EditWorkTaskTemplateModal } from '@thor-frontend/features/real-estate-cards/modals/edit-work-task-templates-modal';
import { useDeleteTemplate } from '@thor-frontend/features/templates/queries/delete-template';
import { useTemplatesPage } from '@thor-frontend/features/templates/queries/templates-page';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { useConfirm } from '@project/ui/confirm';
import { TooltipBox } from '@project/ui';



export type IWorkTaskTemplatesModalProps = {
  isOpen: boolean;
  standardCardId: string;
  onTemplateSelected: (template: TemplateJSON) => void;
  setIsOpen: (value: boolean) => void;
};

/**
 * Component description
 */
export const WorkTaskTemplatesModal: React.FC<IWorkTaskTemplatesModalProps> = (
  props
) => {
  // State
  const [idLoading, setIdLoading] = useState('');
  const [editModalTemplatesIsOpen, setEditModalTemplatesIsOpen] =
    useState(false);
  const [editWorkTask, setEditWorkTask] = useState<TemplateJSON | null>(null);

  const templatesPageQuery = useTemplatesPage({
    query: {
      kind: 'work-task',
      standardCardId: props.standardCardId,
    },
  });

  const deleteTemplate = useDeleteTemplate();
  const confirm = useConfirm();
  const id = useId();

  const templates =
    templatesPageQuery.data?.pages?.flatMap?.((x) => x.items) ?? [];

  const templatesContent = () => {
    return (
      <table className="w-full">
        <thead>
          <tr className="text-sm text-neutral-500">
            <th className="pr-2 pl-5 py-4 font-medium w-[26px]" align="left">
              Type
            </th>
            <th className="px-2 py-4 font-medium" align="left">
              Beskrivelse
            </th>
            <th className="px-2 py-4 font-medium" align="right">
              Antal
            </th>
            <th className="px-2 py-4 font-medium" align="right">
              Enhed
            </th>
            <th className="px-2 py-4 font-medium" align="right">
              Enhedspris (kr.)
            </th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {templates.map((x) => {
            return (
              <tr
                key={x._id}
                className="border-t border-b border-slate odd:bg-neutral-100 cursor-pointer hover:bg-mint"
                onClick={() => props.onTemplateSelected(x)}
              >
                <td className="px-2 pl-5 pr-0 text-black truncate">
                  <WorkTaskTypeIcon
                    workTaskType={
                      x.workTaskContent.workTaskType ?? WorkTaskType.Maintenance
                    }
                  />
                </td>
                <td className="p-2 text-black truncate">
                  {x.workTaskContent.description}
                </td>
                <td
                  className="p-2 w-max text-neutral-500"
                  align="right"
                >
                  {x.workTaskContent.amount}
                </td>
                <td className="p-2 w-max text-neutral-500" align="right">
                  {x.workTaskContent.unit}
                </td>
                <td className="p-2" align="right">
                  <Amount
                    prefix={''}
                    className="w-max text-neutral-500"
                    amount={x.workTaskContent.unitPrice}
                  />
                </td>
                <td className="p-2 w-max" align="right">
                  <span
                    className="whitespace-nowrap text-center"
                    data-tooltip-id={`template-content-${id}-${x._id}`}
                    data-tooltip-content={'Standard budgetposter kan ikke redigeres'}
                  >
                    {idLoading === x._id ? (
                      <div className="h-9 w-8 pt-1.5 pl-5">
                        <SmallSpinnerV2 height="h-5" width="w-5" />
                      </div>
                    ) : (
                      <DropdownMenuV2
                        showRemixIcon
                        remixIconClass={`ri-more-line ${x.isGlobal
                          ? 'text-neutral-200 hover:text-neutral-200'
                          : 'text-neutral-500'
                          }`}
                        align="right"
                        className="inline"
                        items={
                          !x.isGlobal
                            ? [
                              {
                                title: 'Rediger skabelon',
                                className: 'text-black',
                                action: () => {
                                  props.setIsOpen(false);
                                  setEditModalTemplatesIsOpen(true);
                                  setEditWorkTask(x);
                                },
                              },
                              {
                                title: 'Slet',
                                className: 'text-rose-500',
                                action: async () => {
                                  props.setIsOpen(false);
                                  const wasConfirmed = await confirm({
                                    title: 'Slet Skabelon',
                                    body: 'Er du sikker på at du vil slette denne Skabelon? Handlingen kan ikke fortrydes.',
                                    leftButtonColor: 'delete',
                                  });
                                  props.setIsOpen(true);
                                  if (!wasConfirmed) {
                                    return;
                                  }
                                  try {
                                    setIdLoading(x._id);
                                    await deleteTemplate.mutateAsync({
                                      templateId: x._id,
                                    });
                                    toast.success(
                                      'Skabelon er blevet slettet'
                                    );
                                  } catch (err) {
                                    console.log(err);
                                    toast.error(
                                      'Noget gik galt. Skabelonen blev ikke slettet 🤔 Kontakt os hvis det fortsætter.'
                                    );
                                  } finally {
                                    setIdLoading('');
                                  }
                                },
                              },
                            ]
                            : []
                        }
                      />
                    )}
                  </span>
                  {x.isGlobal && <TooltipBox id={`template-content-${id}-${x._id}`} place="left" />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <SideView isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
        <div className="px-8 pb-1">
          <div className="sticky top-0 z-50 pt-8 bg-white flex flex-col justify-between">
            <div className="flex flex-row justify-between">
              <p className="text-xl mb-5">Indsæt budgetpost</p>
              <div
                onClick={() => props.setIsOpen(false)}
                className="ri-close-line text-black text-[24px] cursor-pointer hover:text-black/50"
              ></div>
            </div>
          </div>
          {templatesContent()}

          {editModalTemplatesIsOpen && (
            <EditWorkTaskTemplateModal
              isOpen={editModalTemplatesIsOpen}
              template={editWorkTask}
              onRequestClose={() => {
                props.setIsOpen(true);
                setEditModalTemplatesIsOpen(false);
              }}
              confirmHandler={() => {
                props.setIsOpen(true);
                setEditModalTemplatesIsOpen(false);
              }}
            />
          )}
        </div>
      </SideView>
    </div>
  );
};