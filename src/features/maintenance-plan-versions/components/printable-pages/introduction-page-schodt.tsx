// 3rd party libraries
import React from 'react'

// Workspace libraries
import { SectionHeader } from '@project/ui/printable'
import { Page } from '@project/ui/printable/components/page'



export type IIntroductionPageSchodtProps = {
  unionName: string
}

/**
 * Component description
 */
export const IntroductionSchodtPage: React.FC<IIntroductionPageSchodtProps> = (props) => {

  return <>
    <SectionHeader sectionName='introduction'>Introduktion til jeres nye vedligeholdelsesplan</SectionHeader>
    <p>Kære {props.unionName}</p>
    <br />

    <p>Tillykke med jeres nye vedligeholdelsesplan, og endnu en gang tak, fordi I valgte SCHØDT til at lave den. Vi håber, at den lever op til jeres forventninger.</p>
    <br />

    <p>Nærværende vedligeholdelsesplan er udarbejdet efter en grundig visuel gennemgang af jeres ejendom, og den indeholder deraf en tilstandsvudering på ejendommens bygningsdele og installationer. På baggrund af vores registreringer, sammenlagt med ejendommens historik og data, har vi udarbejdet denne skræddersyede vedligeholdelsesplan til jer.</p>
    <br />

    <p>Vedligeholdelsesplanen har en simpel pædagogisk opbygning, som gerne skulle gøre det let for jer at holde overblikket over bygningens drift og vedligehold. På den måde sørger vi for, at I kan opretholde det nødvendige vedligeholdelsesniveau på ejendommen med mindst mulig indsats.</p>
    <br />

    <p>For at gøre vedligeholdelsesplanen overskuelig, har vi opbygget den således, at I ikke behøver at læse de enkelte bygningsdelskort. I planens indledende afsnit får I det nødvendige overblik til at forstå det vigtigste i vedligeholdelsesplanen, og I kan ud fra dette tage stilling til, hvad der skal gøres nu og her, og hvordan I kommer videre.</p>
    <br />

    <p>Vedligeholdelsesplanen præsenterer jer først for konklusionen på ejendommens tilstand og giver derefter en anbefaling til prioritering af jeres forestående bygge- og renoveringsopgaver. I forlængelse af prioriteringsoversigten får I en guide til håndtering af det videre forløb.</p>
    <br />

    <p>Efter guiden har vi lavet en kort beskrivelse af jeres ejendom inkl. stamdata, en vejledning til hvordan man læser bygnigsdelskortene og en opsummeret tilstandsoversigt.</p>
    <br />

    <p>Herefter har vi udarbejdet et 10-års vedligeholdelsesbudget på baggrund af de anskuede arbejdsopgaver og erfaringspriser, som er beskrevet i bygningsdelskortene. I forlængelse af budgettet har vi lavet en oversigt over de gængse byggesagsudgifter, man som oftest skal tage højde for ved en byggesag.</p>
    <br />

    <p>Giver vedligeholdsplanen anledning til spørgsmål, eller har I brug for sparring til at komme videre med en renoveringsopgave, er I meget velkomne til at kontakte os på telefon 3393 1550.</p>
    <br />

    <p>God læselyst og godt vedligehold.</p>
    <br />
    <br />

    <p>På vegne af SCHØDT A/S</p>
    <p>Søren Schødt</p>
  </>
}