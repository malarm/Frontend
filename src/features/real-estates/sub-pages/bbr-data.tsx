// 3rd party libraries
import React, { useState } from 'react';

// Workspace libraries
import { useResizeObserver } from '@project/ui/hooks';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import UpdateBbrModal from '@thor-frontend/features/real-estates/modals/update-bbr.modal';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';
import { StaticMap } from '@thor-frontend/common/static-map/static-map';



const BbrData = () => {

  // state 
  const realEstateId = useRealEstateId()

  const realEstateQuery = useRealEstateById(realEstateId)
  const realEstate = realEstateQuery.data;

  const [showEditBbrList, setShowEditBbrList] = React.useState(false);

  const [imgWidth, setImgWidth] = useState(750)
  const [imgHeight, setImgHeight] = useState(250)

  const {
    ref: imageContainerRef
  } = useResizeObserver<HTMLDivElement>(
    (size) => {
      setImgWidth(size.contentRect.width)
      setImgHeight(size.contentRect.height)
    },
  )

  const LabelValue = (label: string, value: string) => {
    return <>
      <div className='text-neutral-500 text-sm font-medium'>{label}</div>
      <div className='text-black '>{(value === '' || value === null || value === undefined) ? '-' : value}</div>
    </>
  }

  const addressUsed = realEstate
    ? (realEstate.addressString ?? realEstate.unionName)
    : '';

  return (
    <RealEstateSubPage title={'Stamdata'}>
      <div className="px-8">
        <UpdateBbrModal
          isOpen={showEditBbrList}
          onRequestClose={() => setShowEditBbrList(false)}
          confirmHandler={() => null}
        />
        <div ref={imageContainerRef} className="w-full relative mb-5" style={{ aspectRatio: '10 / 3' }}>

          <StaticMap
            address={addressUsed}
            mapOptions={{
              zoom: 17,
              size: `${Math.round(imgWidth)}x${Math.round(imgHeight)}`,
              markers: addressUsed
            }}
          />

        </div>
        <h2 className="text-xl font-medium mb-5">BBR oplysninger</h2>
        <div className="grid grid-cols-4 w-full gap-8 p-8 border border-neutral-200 rounded-xl my-5">
          <div className='flex flex-col gap-1'>{LabelValue('Ejendomsnavn', realEstate?.unionName)}</div>
          <div className='flex flex-col gap-1'>{LabelValue('Kommune', realEstate?.municipality)}</div>
          <div className='flex flex-col gap-1'>{LabelValue('Matrikelnummer', realEstate?.matrNumber)}</div>
          <div className='flex flex-col gap-1'>{LabelValue('Ejendomsnummer', realEstate?.realEstateNumber.join(', '))}</div>
          <div className="flex flex-col gap-1">
            {
              LabelValue('Opførselsår', realEstate?.buildDate ? formatDate(new Date(realEstate?.buildDate), 'YYYY') : '-')
            }
          </div>
          <div className='flex flex-col gap-1'>{LabelValue('Bygningsareal (m²)', String(realEstate?.totalArea ?? ''))}</div>
          <div className='flex flex-col gap-1'>{LabelValue('Bebygget areal (m²)', String(realEstate?.buildingArea ?? ''))}</div>
          <div className='flex flex-col gap-1'>{LabelValue('Bebygget areal (m²)', String(realEstate?.commercialArea ?? ''))}</div>
          <div className="flex flex-col gap-1">{LabelValue('Beboer areal (m²)', String(realEstate?.residentialArea ?? ''))}</div>
          <div className="flex flex-col gap-1">{LabelValue('Beboer areal (m²)', String(realEstate?.basementArea ?? ''))}</div>
          <div className="flex flex-col gap-1">{LabelValue('Beboer areal (m²)', String(realEstate?.floorCount ?? ''))}</div>
          <div className="flex flex-col gap-1">
            {
              LabelValue('Om-/ tilbygningår', realEstate?.addonDate ? formatDate(new Date(realEstate?.addonDate), 'YYYY') : '-')
            }
          </div>
        </div>
        <div className='flex flex-row mt-5 pb-16'>
          <p
            className='text-black underline mr-5 cursor-pointer'
            onClick={() => setShowEditBbrList(true)}>Rediger BBR oplysninger</p>
          {realEstate?.updatedAt && <p className=' text-sm text-neutral-500 '>Opdateret {formatDate(new Date(realEstate?.updatedAt), 'DD-MM-YYYY HH:mm:SS')} </p >}
        </div>
      </div>


    </RealEstateSubPage>
  );
};

export default BbrData;
