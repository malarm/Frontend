// 3rd party libraries
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

// Workspace libraries
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { RichTextEditor } from '@project/ui/rich-text-editor';
import { RichText } from '@project/ui/rich-text';
import { useUpdateMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/update-maintenance-plan-version';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import NoOverlaySpinnerV2 from '@project/ui/spinner/spinner-no-overlay-v2';
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type'
import { richTextToPlain } from '@project/shared/common/utils/rich-text-to-plain.util'
import { superTrim } from '@project/shared/common/utils/super-trim.util'
import { ThorSubPaths } from '@project/shared/common/enums/thor-paths.enum';
import EditMaintenancePlanTopBtns from '@thor-frontend/features/real-estates/components/edit-maintenance-plan-top-btns';
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
import { useSuggestionPrompt } from '@thor-frontend/features/suggestions/hooks/use-suggestion-prompt';
import { useTemplates } from '@thor-frontend/features/templates/hooks/use-templates';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import MaintenancePlanHeader from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-edit-header';



const MaintenancePlanDescription = () => {
  // State
  const [loading, setLoading] = React.useState(false);
  // Hooks
  const realEstateId = useRealEstateId();
  const client = useQueryClient();
  const editableMaintenancePlanQuery = useEditableMaintenancePlan(realEstateId);
  const liveMaintenancePlanQuery = useLiveMaintenancePlan(realEstateId);
  const realEstateCard = useRealEstateCardById(realEstateId);
  const updateMaintenancePlanVersion = useUpdateMaintenancePlanVersion({
    invalidate: false,
  });

  const [description, SetDescription] = React.useState('');

  useEffect(() => {
    SetDescription(editableMaintenancePlanQuery.data?.realEstateDescription);
  }, [editableMaintenancePlanQuery.isFetchedAfterMount]);

  const getRichText = (value?: string) => {
    return superTrim(richTextToPlain(value ?? ''));
  };

  const hasContent =
    getRichText(editableMaintenancePlanQuery.data?.realEstateDescription)
      .length > 0;

  const queries = [editableMaintenancePlanQuery, liveMaintenancePlanQuery];

  const debouncedOnChange = useDebouncedFunction(
    750,
    async (updatedDescription: string) => {
      await updateMaintenancePlanVersion.mutateAsync({
        maintenancePlanVersionId: editableMaintenancePlanQuery.data._id,
        dto: {
          realEstateDescription: updatedDescription,
        },
      });
      setLoading(false);
    }
  );

  const {
    renderButton: renderTemplateButton,
    renderCustomTemplateSaveButton: renderCustomTemplateSaveButton,
    renderModal: renderTemplateModal,
  } = useTemplates({
    kind: 'real-estate-description',
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

  const onChange = (updatedDescription: string) => {
    SetDescription(updatedDescription);
    setLoading(true);
    if (
      updatedDescription ===
      editableMaintenancePlanQuery.data?.realEstateDescription
    )
      return;

    // optimistic (local) update
    client.setQueryData<MaintenancePlanVersionJSON>(
      useEditableMaintenancePlan.key(realEstateId),
      (previous) => ({
        ...previous,
        realEstateDescription: updatedDescription,
      })
    );

    // debounced PATCH call
    debouncedOnChange(updatedDescription);
  };

  const { renderSuggestion } = useSuggestionPrompt({
    kind: 'real-estate-description',
    onSuggestionAccepted: onChange,
    isShown: editableMaintenancePlanQuery.data && !hasContent,
  });

  const content = () => {
    if (queries.some((x) => x.status === 'loading')) {
      return <NoOverlaySpinnerV2 />;
    }

    if (!editableMaintenancePlanQuery.data) {
      return (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Ejendomsbeskrivelse</h2>
          <RichText
            content={
              editableMaintenancePlanQuery.data?.realEstateDescription ?? ''
            }
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <MaintenancePlanHeader title="Ejendomsbeskrivelse" />

        <div className="flex">
          <span className="mr-3">{renderTemplateButton()}</span>
          {getRichText(description).length > 0 && (
            <span>{renderCustomTemplateSaveButton()}</span>
          )}
        </div>

        <RichTextEditor
          placeholder="Tilføj beskrivelse af ejendommen..."
          onChange={onChange}
          initialValue={editableMaintenancePlanQuery.data.realEstateDescription}
          value={description}
        >
          {renderSuggestion()}
        </RichTextEditor>
      </div>
    );
  };

  const isAutosaving = updateMaintenancePlanVersion.isLoading || loading;

  const nextButtonIsDisabled = () => {
    if (isAutosaving) return true;

    return (
      editableMaintenancePlanQuery.data &&
      !/[a-zA-Z]/.test(
        richTextToPlain(
          editableMaintenancePlanQuery.data.realEstateDescription ?? ''
        )
      )
    );
  };

  return (
    <RealEstateSubPage
      title="Vedligeholdelsesplan"
      topBarChildren={
        <>
          {renderTemplateModal()}
          {/* Buttons */}
          <EditMaintenancePlanTopBtns
            stepsDto={{ isDescriptionConfirmed: true }}
            nextBtnUrlPath={ThorSubPaths.MAINTENANCE_BDK}
            showPreviousBtn={false}
            autoSaving={isAutosaving}
            nextButtonIsDisabled={nextButtonIsDisabled()}
          />
        </>
      }
    >
      <MaintenancePlanContentWrapper>{content()}</MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlanDescription;
