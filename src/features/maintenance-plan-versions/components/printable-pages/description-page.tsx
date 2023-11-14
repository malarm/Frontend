// 3rd party libraries
import React, { ReactNode } from 'react'

// Workspace libraries
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { MaintenancePlanVersionJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-version.type'
import { SectionHeader } from '@project/ui/printable'
import { RichText } from '@project/ui/rich-text'



export type IDescriptionPageProps = {
  description: string
  bbrData: MaintenancePlanVersionJSON['BBRData']
}


const BBRItem = (props: {
  name: ReactNode,
  value: ReactNode
}) => {

  return <div className="p-2 odd:bg-neutral-100 grid grid-flow-col auto-cols-fr">
    <div>{props.name}</div>
    <div>{props.value}</div>
  </div>
}


/**
 * Component description
 */
export const DescriptionPage: React.FC<IDescriptionPageProps> = (props) => {

  return <>
    <SectionHeader sectionName={'description'}>Beskrivelse af ejendommen</SectionHeader>
    <RichText content={props.description}></RichText>
    <br />
    <br />
    <div>
      <h3 className="text-black text-lg mb-2">Stamdata</h3>
      {props.bbrData.municipality ? <BBRItem name={'Kommunenavn'} value={props.bbrData.municipality} /> : ''}
      {props.bbrData.unionName ? <BBRItem name={'Ejendomsnavn'} value={props.bbrData.unionName} /> : ''}
      {props.bbrData.matrNumber ? <BBRItem name={'Matrikel Nr.'} value={props.bbrData.matrNumber} /> : ''}
      {props.bbrData.buildDate ? <BBRItem name={'Opførselsår'} value={formatDate(new Date(props.bbrData.buildDate), 'YYYY')} /> : ''}
      {props.bbrData.addonDate ? <BBRItem name={'Om-/tilbygningsår'} value={formatDate(new Date(props.bbrData.addonDate), 'YYYY')} /> : ''}
      {props.bbrData.totalArea ? <BBRItem name={'Bygningsareal'} value={props.bbrData.totalArea + ' m²'} /> : ''}
      {props.bbrData.buildingArea ? <BBRItem name={'Bebygget areal'} value={props.bbrData.buildingArea + ' m²'} /> : ''}
      {props.bbrData.residentialArea ? <BBRItem name={'Boligareal'} value={props.bbrData.residentialArea + ' m²'} /> : ''}
      {props.bbrData.commercialArea ? <BBRItem name={'Erhvervsareal'} value={props.bbrData.commercialArea + ' m²'} /> : ''}
      {props.bbrData.basementArea ? <BBRItem name={'Kælderareal'} value={props.bbrData.basementArea + ' m²'} /> : ''}
      {props.bbrData.roofArea ? <BBRItem name={'Tagareal'} value={props.bbrData.roofArea + ' m²'} /> : ''}
      {props.bbrData.floorCount ? <BBRItem name={'Etager'} value={props.bbrData.floorCount} /> : ''}
      {props.bbrData.energyLabelValidTo ? <BBRItem name={'Energimærke gyldigt til'} value={formatDate(new Date(props.bbrData.energyLabelValidTo), 'YYYY.MM.DD')} /> : ''}
    </div>

  </>
}