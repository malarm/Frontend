// 3rd party libraries
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

// Workspace libraries
import MaintenancePlanContentWrapper from '@thor-frontend/features/maintenance-plan-versions/components/maintenance-plan-content-wrapper';
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
import MaintenancePlanTopNavigation from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-top-navigation';
import EditMaintenancePlanTopBtns from '@thor-frontend/features/real-estates/components/edit-maintenance-plan-top-btns';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useTemplates } from '@thor-frontend/features/templates/hooks/use-templates';
import MaintenancePlanHeader from '@thor-frontend/features/maintenance-plan-versions/components/edit/maintenance-plan-edit-header';



const MaintenancePlanConclusion = () => {
  // State
  const [loading, setLoading] = React.useState(false);
  // Hooks
  const realEstateId = useRealEstateId();
  const client = useQueryClient();
  const editableMaintenancePlanQuery = useEditableMaintenancePlan(realEstateId);
  const liveMaintenancePlanQuery = useLiveMaintenancePlan(realEstateId);
  const updateMaintenancePlanVersion = useUpdateMaintenancePlanVersion();
  const realEstateCard = useRealEstateCardById(realEstateId);

  const queries = [editableMaintenancePlanQuery, liveMaintenancePlanQuery];
  const [description, SetDescription] = React.useState('');

  React.useEffect(() => {
    SetDescription(editableMaintenancePlanQuery.data?.conclusion);
  }, [editableMaintenancePlanQuery.isFetchedAfterMount]);

  const getRichText = (value?: string) => {
    return superTrim(richTextToPlain(value ?? ''));
  };

  const debouncedOnChange = useDebouncedFunction(
    750,
    async (updatedConclusion: string) => {
      await updateMaintenancePlanVersion.mutateAsync({
        maintenancePlanVersionId: editableMaintenancePlanQuery.data._id,
        dto: {
          conclusion: updatedConclusion,
        },
      });
      setLoading(false);
    }
  );

  const {
    renderButton: renderTemplateButton,
    renderCustomTemplateSaveButton,
    renderModal: renderTemplateModal,
  } = useTemplates({
    kind: 'real-estate-conclusion',
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

  const onChange = (updatedConclusion: string) => {
    SetDescription(updatedConclusion);
    setLoading(true);
    if (updatedConclusion === editableMaintenancePlanQuery.data?.conclusion)
      return;

    // optimistic (local) update
    client.setQueryData<MaintenancePlanVersionJSON>(
      useEditableMaintenancePlan.key(realEstateId),
      (previous) => ({
        ...previous,
        conclusion: updatedConclusion,
      })
    );

    // debounced PATCH call
    debouncedOnChange(updatedConclusion);
  };

  const content = () => {
    if (queries.some((x) => x.status === 'loading')) {
      return <NoOverlaySpinnerV2 />;
    }

    if (!editableMaintenancePlanQuery.data) {
      return (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Conclusion</h2>
          <RichText
            content={editableMaintenancePlanQuery.data?.conclusion ?? ''}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <MaintenancePlanHeader title="Konklusion" />

        <div className="flex">
          <span className="mr-3">{renderTemplateButton()}</span>
          {getRichText(description).length > 0 && (
            <span>{renderCustomTemplateSaveButton()}</span>
          )}
        </div>

        <RichTextEditor
          placeholder="Tilføj konklusion af ejendommen..."
          onChange={onChange}
          initialValue={editableMaintenancePlanQuery.data.conclusion}
          value={description}
        />
      </div>
    );
  };

  const nextBtnDisabled = () => {
    if (updateMaintenancePlanVersion.isLoading || loading) return true;

    return (
      editableMaintenancePlanQuery.data &&
      !/[a-zA-Z]/.test(
        richTextToPlain(editableMaintenancePlanQuery.data.conclusion ?? '')
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
            stepsDto={{ isConclusionConfirmed: true }}
            nextBtnUrlPath={ThorSubPaths.MAINTENANCE_PUBLISH}
            prevBtnUrlPath={ThorSubPaths.MAINTENANCE_BUDGET}
            autoSaving={updateMaintenancePlanVersion.isLoading || loading}
            nextButtonIsDisabled={nextBtnDisabled()}
          // hasPublishHandler
          />
        </>
      }
    >
      <MaintenancePlanContentWrapper>{content()}</MaintenancePlanContentWrapper>
    </RealEstateSubPage>
  );
};

export default MaintenancePlanConclusion;
