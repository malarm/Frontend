// 3rd party libraries
import React, { forwardRef, RefObject } from 'react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

// Workspace libraries
import { useBDKSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer';
import { TruncatedText, usePathParamV2 } from '@project/ui';
import { useConfirm } from '@project/ui/confirm';
import { useHiddenFileInput } from '@thor-frontend/common/files/use-hidden-file-input';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import toast from '@thor-frontend/common/utils/toast';
import { useCreateRealEstateCardDocuments } from '@thor-frontend/features/real-estate-cards/queries/documents/create-real-estate-card-document';
import { useDeleteRealEstateCardDocument } from '@thor-frontend/features/real-estate-cards/queries/documents/delete-real-estate-card-document';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { formatBytes } from '@project/shared/common/utils/format-bytes.util';
import { getErrorMessage } from '@project/ui/get-error-message';
import { getFileByKey } from '@thor-frontend/common/files/get-file-by-key';
import { useSetRealEstateCardIsLoading } from '@thor-frontend/features/real-estate-cards/stores/real-estate-card-load-state.store';
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table';




/**
 * The "Dokumenter" section of the real estate card details view
 */

export const Documents = () => {
  const [realEstateCardId] = usePathParamV2('bdkId');
  const confirm = useConfirm();

  const realEstateCardQuery = useRealEstateCardById(realEstateCardId);
  const createDocumentsQuery = useCreateRealEstateCardDocuments();
  const deleteDocumentQuery = useDeleteRealEstateCardDocument();
  const setIsLoading = useSetRealEstateCardIsLoading();

  const deleteDocument = async (documentId: string) => {
    try {
      const wasConfirmed = await confirm({
        title: 'Slet dokument',
        body: 'Er du sikker på du ønsker at slette det valgte dokument?',
        rightButtonColor: 'black',
      });

      if (!wasConfirmed) return;

      await deleteDocumentQuery.mutateAsync({
        realEstateCardId,
        documentId,
      });

      toast.success('Dokument slettet!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onFileInput = async (files: File[]) => {
    try {
      setIsLoading(true);
      await createDocumentsQuery.mutateAsync({
        realEstateCardId: realEstateCardId,
        documentFiles: files,
      });

      toast.success(`${files.length > 1 ? 'Filer' : 'Fil'} tilføjet!`);
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }

    // console.log({ files });
  };

  const { openFilePicker, renderInput } = useHiddenFileInput({
    onFileInput,
  });

  const documents = realEstateCardQuery.data?.documents ?? [];

  const documentsContent = () => {
    if (documents.length === 0) {
      return <p>Der er endnu ikke tilføjet nogen dokumenter</p>;
    }

    return (
      <ThorTable
        data={documents}
        onRowClick={async (event, data) => {
          try {
            event.stopPropagation();

            const response = await getFileByKey(data.awsMetadata?.Key ?? '');

            const _file = new Blob([response.data], { type: data.mimetype });

            //Build a URL from the file
            const fileURL = URL.createObjectURL(_file);

            //Open the URL on new Window
            window.open(fileURL);
          } catch (err) {
            toast.error(
              'Filen kunne ikke hentes. Kontakt vores support hvis du mener dette er en fejl.'
            );
          }
        }}
        tbody={{
          className: 'hover:bg-black hover:bg-opacity-5 cursor-pointer',
        }}
        columns={[
          // icon
          {
            colProps: {
              className: 'w-0',
            },
            header: '',
            cell: (document) => (
              <div className="grid place-content-center rounded-xl bg-black bg-opacity-5 w-8 h-8">
                <i className="ri-attachment-2 text-neutral-500 text-[20px]"></i>
              </div>
            ),
          },

          // name
          {
            header: 'Navn',
            cell: (document) => (
              <TruncatedText className="text-black text-[16px] font-medium">
                {document.filename}
              </TruncatedText>
            ),
            thClassName: (defaults) => defaults + ' text-left',
          },

          // upload date
          {
            header: 'Uploaded',
            cell: (document) =>
              format(new Date(document.createdAt), 'dd-MM-yyyy', {
                locale: da,
              }),
          },

          // uploader name
          {
            header: 'Uploaded af',
            cell: (document) => document.uploaderMeta?.name ?? 'ukendt',
          },

          // size
          {
            header: 'Størrelse',
            cell: (document) => formatBytes(document.size),
          },

          // remove
          {
            header: 'Fjern',
            tdClassName: () => 'p-2 grid place-content-center',
            cell: (document) => (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  deleteDocument(document._id);
                }}
                className="grid place-content-center w-8 h-8 cursor-pointer"
              >
                <i className="ri-delete-bin-line text-[24px] text-black/50 hover:text-black/100"></i>
              </div>
            ),
            colProps: {
              className: 'w-0',
            },
          },
        ]}
      />
    );
  };

  return (
    <div
      className="pb-8 flex flex-col gap-6 mt-8 mb-6"
    >
      <h2 className="text-xl text-black">6. Dokumenter</h2>

      {renderInput()}
      <UpsiteButton
        onClick={openFilePicker}
        type="secondary"
        isLoading={createDocumentsQuery.isLoading}
      ><i className="text-xl ri-upload-line" /> Upload filer</UpsiteButton>

      <div>{documentsContent()}</div>
    </div>
  );
}

