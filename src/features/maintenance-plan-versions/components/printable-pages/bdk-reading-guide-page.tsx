// 3rd party libraries
import React from 'react'

// Workspace libraries
import { Condition } from '@project/shared/feature-real-estate-cards/enums/condition.enum'
import { SectionHeader } from '@project/ui/printable'
import { ConditionItemV2 } from '@thor-frontend/features/real-estate-cards/components/condition-item-v2'
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components'



export type IBDKReadingGuidePageProps = {
  // 
}

/**
 * Component description
 */
export const BDKReadingGuidePage: React.FC<IBDKReadingGuidePageProps> = (props) => {

  return <>
    <SectionHeader sectionName='vejledning-til-bygningsdelskortene'>Vejledning til bygningsdelskortene</SectionHeader>

    <p className="mb-6">
      I det kommende afsnit vil vi gennemgå tilstanden på de individuelle bygningsdele, som er blevet besigtiget ved
      gennemgangen af jeres ejendom. Konkrete observationer står i <em>Beskrivelse</em>, mens det anbefalede løbende
      vedligehold står i <em>Vedligehold</em>. Såfremt der er behov for udgiftsrelateret vedligehold eller renovering, følger dernæst
      en opgaveoversigt med prisoverslag på, hvad det vil koste.
    </p>

    <p className="mb-6">
      Nederst i bygningsdelskortene finder I fotoregistrering med billeder taget ved gennemgangen på jeres ejendom.
    </p>

    <p className="mb-6">
      Alle opgaver i vedligeholdelsesplanen opdeles efter <em>Drift</em>, <em>Vedligehold</em> og <em>Forbedring</em>.
    </p>

    <p className="mb-12">
      Nedenfor ses en nærmere beskrivelse af de 3 kategorier.
    </p>

    {/* work task type explainers */}
    <div>
      <div className="grid gap-9" style={{ 'gridTemplateColumns': 'max-content 1fr' }}>

        {/* V */}
        <div className="font-semibold text-black flex flex-row gap-2 items-center self-start">
          <WorkTaskTypeIcon workTaskType='maintenance' />
          <p>Vedligehold</p>
        </div>
        <p>
          Vedligehold omfatter løbende vedligehold, der traditionelt både omfatter
          forebyggende, planlagt vedligehold og afhjælpende vedligehold. Alle dele har til
          formål længst muligt at opretholde bygningsdelens levetid, udseende og funktioner.
          Afhjælpende vedligehold er erfaringsmæssigt dyrere end planlagt vedligehold.
        </p>

        {/* D */}
        <div className="font-semibold text-black flex flex-row gap-2 items-center self-start">
          <WorkTaskTypeIcon workTaskType='operating' />
          <p>Drift</p>
        </div>
        <p>
          Drift omfatter eftersyn, inspektion og tjek, som udføres af ejendommens ejer,
          ejendomsinspektør, vicevært, tekniker eller entreprenør. Herudover indeholder Drift
          abonnementsordninger til f.eks. varmeanlæg, ventilation og lignende.
        </p>

        {/* F */}
        <div className="font-semibold text-black flex flex-row gap-2 items-center self-start">
          <WorkTaskTypeIcon workTaskType='improvement' />
          <p>Forbedring</p>
        </div>
        <p>
          Forbedring omfatter opretningsarbejder, som også kan benævnes som genopretning
          eller total forbedring/udskiftning af nedslidte bygningsdele. Herudover omfatter det
          moderniserings- eller forbedringsarbejder, der bibringer ejendommen nye kvaliteter
          og funktioner, f.eks. isolerings- og badeværelsesarbejder, etablering af nye tekniske
          installationer og faciliteter.
        </p>
      </div>
    </div>

    {/* condition explainer  */}
    <div>
      <div className="grid gap-6 items-center mt-12" style={{ 'gridTemplateColumns': 'max-content 1fr' }}>

        <ConditionItemV2 condition={Condition.GOOD} sizeClassName={'h-8 w-8'} />
        <p>Bygningsdelens tilstand vurderes som <span className="font-semibold underline">meget god</span></p>

        <ConditionItemV2 condition={Condition.ACCEPTABLE} sizeClassName={'h-8 w-8'} />
        <p>Bygningsdelens tilstand vurderes som <span className="font-semibold underline">acceptabel</span></p>

        <ConditionItemV2 condition={Condition.BAD} sizeClassName={'h-8 w-8'} />
        <p>Bygningsdelens tilstand vurderes som <span className="font-semibold underline">mindre god</span></p>

        <ConditionItemV2 condition={Condition.CRITICAL} sizeClassName={'h-8 w-8'} />
        <p>Bygningsdelens tilstand vurderes som <span className="font-semibold underline">kritisk</span></p>

      </div>
    </div>
  </>
}