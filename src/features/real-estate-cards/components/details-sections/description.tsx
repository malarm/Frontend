// 3rd party libraries
import React, { forwardRef, RefObject, Dispatch, SetStateAction, useEffect, useState, } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Workspace libraries
import { useBDKSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer';
import { RichTextEditor } from '@project/ui/rich-text-editor';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { usePathParamV2 } from '@project/ui';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useUpdateRealEstateCard } from '@thor-frontend/features/real-estate-cards/queries/update-real-estate-card';
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type'
import { richTextToPlain } from '@project/shared/common/utils/rich-text-to-plain.util'
import { superTrim } from '@project/shared/common/utils/super-trim.util';
import { useSetRealEstateCardIsLoading } from '@thor-frontend/features/real-estate-cards/stores/real-estate-card-load-state.store';
import toast from '@thor-frontend/common/utils/toast';
import { useTemplates } from '@thor-frontend/features/templates/hooks/use-templates';
import { useSuggestionPrompt } from '@thor-frontend/features/suggestions/hooks/use-suggestion-prompt';




/**
 * The "Beskrivelse" section of the real estate card details view
 */
export const Description = () => {

  const setIsLoading = useSetRealEstateCardIsLoading();

  // State
  const [refreshEditor, setRefreshEditor] = useState<boolean>(false);

  // Hooks
  const updateRealEstateCard = useUpdateRealEstateCard({ invalidate: false });

  const [realEstateCardId] = usePathParamV2('bdkId');

  const client = useQueryClient();

  const realEstateCard = useRealEstateCardById(realEstateCardId);

  const [description, SetDescription] = React.useState(
    realEstateCard.data?.extentDescriptionRich
  );

  const getRichText = (value?: string) => {
    return superTrim(richTextToPlain(value ?? ''));
  };

  const debouncedOnChange = useDebouncedFunction(
    750,
    async (updatedExtentDescription: string) => {
      try {
        await updateRealEstateCard.mutateAsync({
          realEstateCardId: realEstateCard.data._id,
          body: {
            extentDescriptionRich: updatedExtentDescription,
          },
        });
        SetDescription(updatedExtentDescription);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const onChange = (updatedExtentDescription: string) => {
    if (
      updatedExtentDescription === realEstateCard.data?.extentDescriptionRich
    )
      return;

    // optimistic (local) update
    client.setQueryData<RealEstateCardJSON>(
      useRealEstateCardById.key(realEstateCardId),
      (previous) => ({
        ...previous,
        extentDescriptionRich: updatedExtentDescription,
      })
    );

    setIsLoading(true);

    // debounced PATCH call
    debouncedOnChange(updatedExtentDescription);
  };

  const { renderSuggestion } = useSuggestionPrompt({
    isShown:
      realEstateCard.data && !realEstateCard.data.extentDescriptionRich,
    kind: 'real-estate-card-description',
    onSuggestionAccepted: onChange,
    standardCardId: realEstateCard.data?.standardCardId,
  });

  useEffect(() => {
    setRefreshEditor(false);
    setTimeout(() => setRefreshEditor(true), 1);
  }, [realEstateCardId]);

  const {
    renderButton: renderTemplateButton,
    renderCustomTemplateSaveButton: renderCustomTemplateSaveButton,
    renderModal: renderTemplateModal,
  } = useTemplates({
    kind: 'real-estate-card-description',
    standardCardId: realEstateCard.data?.standardCardId,
    getCustomTemplateContent: () => description,
    onTemplateSelected: (content: string) => {
      onChange(content);
    },
    onSavedCustomTemplate: (content: string) => {
      onChange(content);
    },
    activeValue: description,
  });

  const content = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex">
          <span className="mr-3">{renderTemplateButton()}</span>
          {getRichText(description).length > 0 && (
            <span>{renderCustomTemplateSaveButton()}</span>
          )}
        </div>

        <div>
          {refreshEditor && (
            <RichTextEditor
              placeholder="Tilføj Beskrivelse af bygningsdelen..."
              onChange={onChange}
              initialValue={realEstateCard.data?.extentDescriptionRich}
              value={realEstateCard.data?.extentDescriptionRich}
            >
              {renderSuggestion()}
            </RichTextEditor>
          )}
        </div>
      </div>
    );
  };
  return (
    <div
      className="pb-8 border-b border-slate"
    >
      {renderTemplateModal()}
      <h2 className="text-xl mt-8 text-black mb-6">2. Beskrivelse</h2>
      <div>{content()}</div>
    </div>
  );
}

