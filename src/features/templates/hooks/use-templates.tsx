// 3rd party libraries
import React, { ReactNode, useState } from 'react';

// Workspace libraries
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type'
import { TemplateKind } from '@project/shared/feature-templates/enums/template-kind.enum';
import { AddTemplateButton } from '@thor-frontend/common/add-template-button/add-template-button';
import { useTemplatesPage } from '@thor-frontend/features/templates/queries/templates-page';
import { SideView } from '@thor-frontend/common/sideview/sideview.component';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { RichText } from '@project/ui/rich-text';
import CreateCustomTemplateModal from '@thor-frontend/features/templates/modals/create-custom-template.modal';
import { useDeleteTemplate } from '@thor-frontend/features/templates/queries/delete-template';
import toast from '@thor-frontend/common/utils/toast';
import { useConfirm } from '@project/ui/confirm';
import { EditCustomTemplateModal } from '@thor-frontend/features/templates/modals/edit-custom-template.modal';



type IUseTemplatesProps<T extends TemplateKind> = {
  /**
   * Used in the template query
   */
  kind: T;

  /**
   * Used in the template query
   */
  standardCardId?: string;

  getCustomTemplateContent?: () => string;

  /**
   * Triggered when a template is selected in the modal
   *
   * @param template
   * @returns
   */
  onTemplateSelected: (content: string) => void;

  onSavedCustomTemplate?: (content: string) => void;
  /**
   * The value that the template is supposed to replace or add to
   */
  activeValue: string;
};

type IUseTemplatesResult = {
  /**
   * Renders a button. When clicked,
   * it opens the template side view
   */
  renderButton: () => ReactNode;

  /**
   * Renders a button. When clicked,
   * it opens the custom template modal
   */
  renderCustomTemplateSaveButton: () => ReactNode;

  /**
   * Renders the template selector modal
   */
  renderModal: () => ReactNode;
  // /**
  //  * The value that the template is supposed to replace or add to
  //  */
  // activeValue: string;
};

type TemplateContentProp<T extends TemplateKind> = {
  template: TemplateJSON & { kind: T };
  setEditCustomTemplate: (template: TemplateJSON) => void;
  setIsOpenCustomEditModal: (value: boolean) => void;
  onTemplateSelected: (template: string) => void;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  activeValue: string;
};
const TemplateItem = <T extends TemplateKind>(
  props: TemplateContentProp<T>
) => {
  const content =
    props.template.content ?? props.template.workTaskContent?.description;
  const needTruncating = content.length > 100;
  const [showTruncatedText, setShowTruncatedText] = useState(false);
  const confirm = useConfirm();
  const [idLoading, setIdLoading] = useState('');
  const ToolTipText = props.template.isGlobal
    ? 'Standard beskrivelser kan ikke slettes eller redigeres.'
    : 'Kommer snart';

  // Close Desciption 'Show more..' when it's open or closed
  React.useEffect(() => {
    setShowTruncatedText(false);
  }, [props.isOpen]);

  const deleteTemplate = useDeleteTemplate();

  const deleteCustomTemplate = async () => {
    props.setIsOpen(false);
    const wasConfirmed = await confirm({
      title: 'Slet skabelon',
      body: 'Er du sikker på at du vil slette denne skabelon? Handlingen kan ikke fortrydes.',
      leftButtonColor: 'delete',
    });

    props.setIsOpen(true);

    if (!wasConfirmed) {
      return;
    }
    try {
      setIdLoading(props.template._id);
      await deleteTemplate.mutateAsync({
        templateId: props.template._id,
      });
      toast.success('Skabelon er blevet slettet');
    } catch (err) {
      console.log(err);
      toast.error(
        'Noget gik galt. Skabelonen blev ikke slettet 🤔 Kontakt os hvis det fortsætter.'
      );
    } finally {
      setIdLoading('');
    }
  };

  return (
    <>
      <div className="w-100 mt-6">
        <div className="flex justify-between mb-5">
          <p className="text-black text-lg">{props.template.title}</p>
          <p className="text-neutral-500 text-[14px]">
            {props.template.isGlobal ? 'Standard' : 'Brugerdefineret'}
          </p>
        </div>
        <div className="p-4 mb-6 rounded-xl bg-neutral-100">
          <RichText
            className={showTruncatedText ? `` : 'line-clamp-3'}
            content={content}
          />
          {needTruncating && (
            <p
              onClick={() => setShowTruncatedText(!showTruncatedText)}
              className="text-neutral-500 cursor-pointer font-medium mt-1 hover:text-black"
            >
              {showTruncatedText ? 'Se mindre -' : 'Se mere +'}
            </p>
          )}
        </div>
        <div className="mb-5 flex justify-end ">
          {!props.template.isGlobal && (
            <>
              <UpsiteButton type="secondary" onClick={deleteCustomTemplate} className="mr-2"><i className="text-xl ri-delete-bin-line" /></UpsiteButton>
              <UpsiteButton type="secondary" onClick={() => {
                props.setIsOpen(false);
                props.setIsOpenCustomEditModal(true);
                props.setEditCustomTemplate(props.template);
              }} className="mr-2"><i className="text-xl ri-edit-line" /> </UpsiteButton>
            </>
          )}

          <UpsiteButton type="secondary" onClick={async () => {
            // Parse Stringified p tag to get data
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(
              props.activeValue,
              'text/html'
            );
            const pTagText = htmlDoc.body.textContent;
            if (pTagText && props.activeValue) {
              const wasConfirmed = await confirm({
                title: 'Indsæt skabelon',
                body: 'Vil du overskrive eksisterende indhold eller tilføje denne skabelon som nyt afsnit?',
                rightButtonColor: 'whiteBorder',
                rightButtonText: 'Overskriv',
                leftButtonText: 'Tilføj som nyt afsnit',
                leftButtonColor: 'black',
              });
              // If Tilføj som ny paragraf
              if (!wasConfirmed) {
                const content = `${props.activeValue}<br/>${props.template.content}`;
                props.onTemplateSelected(content);
                props.setIsOpen(false);
                setShowTruncatedText(false);
                return;
              }
            }
            // Overskriv
            const content = props.template.content;
            props.onTemplateSelected(content);
            props.setIsOpen(false);
            setShowTruncatedText(false);
          }}><i className="text-xl ri-add-line" /> Indsæt</UpsiteButton>
        </div>
      </div>
      <hr />
    </>
  );
};

/**
 * Hook for rendering a template selector modal
 * and button (for modal opening)
 *
 * @example
 * ```
 * const MyComponent = () => {
 *   const [description, setDescription] = useState('')
 *
 *   const {
 *     renderButton,
 *     renderModal
 *   } = useTemplates({
 *     kind: 'real-estate-description',
 *     onChange: template => setDescription(template.content)
 *     })
 *   }
 *
 *   return <div>
 *     ...
 *     {renderModal()}
 *     {renderButton()}
 *     ...
 *   </div>
 *
 * ```
 *
 * @returns
 */
export const useTemplates = <T extends TemplateKind>(
  props: IUseTemplatesProps<T>
): IUseTemplatesResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCustomSaveModal, setIsOpenCustomSaveModal] = useState(false);
  const [isOpenCustomEditModal, setIsOpenCustomEditModal] = useState(false);
  const [editCustomTemplate, setEditCustomTemplate] = useState<TemplateJSON>();
  const [customTemplateText, setCustomTemplateText] = useState(
    props.getCustomTemplateContent()
  );

  const templatesPageQuery = useTemplatesPage({
    query: {
      kind: props.kind,
      standardCardId: props.standardCardId,
    },
  });

  const templates =
    templatesPageQuery.data?.pages?.flatMap?.((x) => x.items) ?? [];

  const renderButton = () => (
    <AddTemplateButton onClick={() => setIsOpen(true)} />
  );

  const renderCustomTemplateSaveButton = () => (
    <UpsiteButton onClick={() => OpenCustomTemplateModal()} type="secondary">
      <i className="ri-save-line text-xl text-black" /> Gem som skabelon
    </UpsiteButton>
  );

  const OpenCustomTemplateModal = () => {
    setCustomTemplateText(props.getCustomTemplateContent());
    setIsOpenCustomSaveModal(true);
  };

  const renderModal = () => (
    <>
      <SideView isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="px-8 pb-1">
          <div className="sticky top-0 z-50 pt-8 bg-white flex flex-col justify-between">
            <div
              className="flex flex-row justify-between"
              onClick={() => setIsOpen(false)}
            >
              <p className="text-xl mb-5">Indsæt skabelon</p>
              <div className="ri-close-line text-black text-[24px] cursor-pointer hover:text-black/50"></div>
            </div>
            {templates.length === 0 && (
              <p className="text-neutral-500">
                Der er ingen tilgængelige forslag/skabeloner
              </p>
            )}
          </div>

          {templates.map((x: any) => {
            return (
              <TemplateItem
                isOpen={isOpen}
                key={x._id.toString()}
                template={x}
                setEditCustomTemplate={setEditCustomTemplate}
                setIsOpenCustomEditModal={setIsOpenCustomEditModal}
                onTemplateSelected={props.onTemplateSelected}
                setIsOpen={setIsOpen}
                activeValue={props.activeValue}
              />
            );
          })}
        </div>
      </SideView>

      <CreateCustomTemplateModal
        content={customTemplateText}
        isOpen={isOpenCustomSaveModal}
        kind={props.kind}
        onSavedTemplate={props.onSavedCustomTemplate}
        standardCardId={props.standardCardId}
        onRequestClose={() => setIsOpenCustomSaveModal(false)}
        confirmHandler={() => setIsOpenCustomSaveModal(false)}
      />

      <EditCustomTemplateModal
        template={editCustomTemplate}
        isOpen={isOpenCustomEditModal}
        onRequestClose={() => {
          setIsOpen(true);
          setIsOpenCustomEditModal(false);
        }}
        confirmHandler={() => {
          setIsOpen(true);
          setIsOpenCustomEditModal(false);
        }}
      />
    </>
  );

  return {
    renderButton,
    renderCustomTemplateSaveButton,
    renderModal,
  };
};
