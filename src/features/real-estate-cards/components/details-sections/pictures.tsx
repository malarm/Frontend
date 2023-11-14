// 3rd party libraries
import { useQueryClient } from '@tanstack/react-query';
import React, { createRef, FormEvent, useState, forwardRef, RefObject, } from 'react';
import classNames from 'classnames';

// Workspace libraries
import { useBDKSectionObserver } from '@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer';
import { getErrorMessage } from '@project/ui/get-error-message';
import { MEDocumentJSON } from '@project/shared/feature-me-document/interfaces/me-document.interface'
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type';
import { ImageViewer } from '@project/ui/image-viewer';
import { useConfirm } from '@project/ui/confirm';
import { usePathParamV2 } from '@project/ui/hooks/use-path-param-v2';
import { Checkbox } from '@thor-frontend/common/checkbox/checkbox';
import { useDebouncedFunction } from '@thor-frontend/common/hooks/use-debounced-function';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image';
import { getCDNUrl } from '@thor-frontend/common/utils';
import toast from '@thor-frontend/common/utils/toast';
import { useCreateRealEstateCardPictures } from '@thor-frontend/features/real-estate-cards/queries/pictures/create-real-estate-card-pictures';
import { useDeleteRealEstateCardPicture } from '@thor-frontend/features/real-estate-cards/queries/pictures/delete-real-estate-card-picture';
import { useDisableRealEstateCardPicture } from '@thor-frontend/features/real-estate-cards/queries/pictures/disable-real-estate-card-picture';
import { useEnableRealEstateCardPicture } from '@thor-frontend/features/real-estate-cards/queries/pictures/enable-real-estate-card-picture';
import { useUpdateRealEstateCardPictureMeta } from '@thor-frontend/features/real-estate-cards/queries/pictures/update-real-estate-card-picture-meta';
import { useRealEstateCardById } from '@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id';
import { useHiddenFileInput } from '@thor-frontend/common/files/use-hidden-file-input';
import { useSetRealEstateCardIsLoading } from '@thor-frontend/features/real-estate-cards/stores/real-estate-card-load-state.store';



/**
 * The "Billeder" section of the real estate card details view
 */

export const Pictures = () => {
  const [bdkId] = usePathParamV2('bdkId');


  const confirm = useConfirm();

  const realEstateCardQuery = useRealEstateCardById(bdkId);
  const enablePictureQuery = useEnableRealEstateCardPicture();
  const disablePictureQuery = useDisableRealEstateCardPicture();
  const deletePictureQuery = useDeleteRealEstateCardPicture();
  const updateImageMetaQuery = useUpdateRealEstateCardPictureMeta({
    invalidate: false,
  });
  const createRealEstateCardPictures = useCreateRealEstateCardPictures();
  const setIsLoading = useSetRealEstateCardIsLoading();

  const [imageViewerIsOpen, setImageViewerIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const client = useQueryClient();

  const pictures = realEstateCardQuery.data?.pictures ?? [];

  const onFileInput = async (files: File[]) => {
    try {
      setIsLoading(true);
      await createRealEstateCardPictures.mutateAsync({
        realEstateCardId: bdkId,
        pictureFiles: files,
      });

      toast.success(`${files.length > 1 ? 'Filer' : 'Fil'} tilføjet!`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const { openFilePicker, renderInput } = useHiddenFileInput({
    onFileInput,
  });

  const pictureIsEnabled = (picture: { _id: string }) => {
    if (!realEstateCardQuery.data) return false;

    const { enabledPictures } = realEstateCardQuery.data;

    return enabledPictures.includes(picture._id);
  };

  const enablePicture = (picture: { _id: string }) => {
    try {
      enablePictureQuery.mutateAsync({
        realEstateCardId: bdkId,
        pictureId: picture._id,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openImageViewer = (index = 0) => {
    setImageViewerIsOpen(true);
    setImageIndex(index);
  };

  const disablePicture = (picture: { _id: string }) => {
    try {
      disablePictureQuery.mutateAsync({
        realEstateCardId: bdkId,
        pictureId: picture._id,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const deletePicture = async (picture: { _id: string }) => {
    try {
      const wasConfirmed = await confirm({
        rightButtonColor: 'black',
        title: 'Slet billede',
        body: 'Det valgte billede slettes',
      });

      if (!wasConfirmed) return;

      await deletePictureQuery.mutateAsync({
        realEstateCardId: bdkId,
        pictureId: picture._id,
      });

      toast.success('Billede fjernet');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const debouncedUpdateImageMeta = useDebouncedFunction(
    500,
    async (picture: { _id: string }, meta: MEDocumentJSON['meta']) => {
      await updateImageMetaQuery.mutateAsync({
        realEstateCardId: bdkId,
        pictureId: picture._id,
        body: meta,
      });

      setIsLoading(false);
    }
  );

  const updateImageMeta = async (
    picture: { _id: string },
    meta: MEDocumentJSON['meta']
  ) => {
    try {
      client.setQueryData<RealEstateCardJSON>(
        useRealEstateCardById.key(bdkId),
        (old) => {
          return {
            ...old,
            pictures: old.pictures.map((x) => {
              if (x._id !== picture._id) return x;

              return {
                ...x,
                meta: {
                  ...(x.meta ?? {}),
                  ...meta,
                },
              };
            }),
          };
        }
      );
      setIsLoading(true);

      debouncedUpdateImageMeta(picture, meta);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const picturesContent = () => {
    if (pictures.length === 0) {
      return (
        <p className="text-neutral-500 italic">
          Der er endnu ikke tilføjet nogen billeder
        </p>
      );
    }

    return pictures.map((picture, index) => (
      <div className="flex flex-col gap-4">
        <ThorImage
          src={getCDNUrl(picture.awsMetadata?.Key, '640w')}
          className="rounded-xl aspect-video"
        >
          <div className="absolute inset-0 grid place-content-center grid-flow-col gap-2 opacity-0 hover:opacity-100 transition-opacity duration-100 hover:bg-black/25">
            {/* image controls */}

            <div
              onClick={() => openImageViewer(index)}
              className="w-[52px] h-[40px] bg-white border border-gray-200 hover:bg-neutral-100 rounded-xl grid place-content-center cursor-pointer"
            >
              <i className="ri-zoom-in-line"></i>
            </div>

            <div
              onClick={() => deletePicture(picture)}
              className="w-[52px] h-[40px] bg-white border border-gray-200 text-rose-500 hover:bg-neutral-100 rounded-xl grid place-content-center cursor-pointer"
            >
              <i className="ri-delete-bin-line"></i>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Checkbox
              isChecked={pictureIsEnabled(picture)}
              onChange={(value) => {
                if (value === true) {
                  enablePicture(picture);
                } else {
                  disablePicture(picture);
                }
              }}
            />
          </div>
        </ThorImage>

        <div className="flex flex-col gap-2">
          {/* title */}
          <input
            className="font-medium bg-transparent placeholder:text-neutral-500 outline-none"
            placeholder="Tilføj en titel..."
            value={picture.meta?.title ?? ''}
            maxLength={50}
            onChange={(e) => {
              updateImageMeta(picture, {
                title: e.currentTarget.value,
              })
              if (e.target.value.length === 50) {
                toast.info('Det maksimale antal anslag er nået')
              }
            }
            }
          />

        </div>
      </div>
    ));
  };

  return (
    <div className="border-b border-slate flex flex-col gap-6 pb-8">
      <ImageViewer
        closeBox={() => setImageViewerIsOpen(false)}
        currentImage={imageIndex}
        open={imageViewerIsOpen}
        files={pictures.map((picture) => ({
          ...picture,
          src: getCDNUrl(picture.awsMetadata.Key, '1280w'),
        }))}
      />

      <h2 className="text-xl mt-8 text-black">
        5. Billeder
      </h2>

      {/* buttons */}

      {renderInput()}

      <UpsiteButton onClick={openFilePicker} type="secondary"><i className="text-xl ri-image-add-line" /> Tilføj billeder</UpsiteButton>
      <p className="neutral-500 text-sm">
        Billeder markeret med checkmark vil indgå i PDF.
      </p>

      {/* picture grid */}
      <div className="grid grid-flow-row grid-cols-2 gap-x-4 gap-y-8 max-w-[1024px]">
        {picturesContent()}
      </div>
    </div>
  );
}

