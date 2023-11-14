// 3rd party libraries
import React from 'react'

// Workspace libraries
import { SectionHeader } from '@project/ui/printable'
import { Page } from '@project/ui/printable/components/page'



export type IIntroductionPageProps = {
  unionName: string
}

/**
 * Component description
 */
export const IntroductionPage: React.FC<IIntroductionPageProps> = (props) => {

  return <>
    <SectionHeader sectionName='introduction'>Introduktion til jeres nye vedligeholdelsesplan</SectionHeader>
    <p>Kære {props.unionName}.</p>
    <br />

    <p>Tillykke med jeres nye vedligeholdelsesplan.</p>
    <br />

    <h3 className="text-lg font-semibold text-black">Den traditionelle vedligeholdelsesplan i PDF</h3>

    <p>Nærværende vedligeholdelsesplanen har en simpel pædagogisk opbygning, som gerne skulle gøre det let for jer at holde overblikket over bygningens drift og vedligehold.</p>
    <br />

    <p>For at gøre vedligeholdelsesplanen overskuelig, er den opbygget således, at du ikke behøver at læse de enkelte bygningsdelskort. I planens indledende afsnit får du det nødvendige overblik til at forstå det vigtigste i vedligeholdelsesplanen, og du kan ud fra dette tage stilling til, hvad der skal gøres nu og her, og hvordan du kommer videre.</p>
    <br />

    <p>Vedligeholdelsesplanen præsenterer dig først for konklusionen på ejendommens tilstand. Du bliver dernæst præsenteret for en kort beskrivelse af jeres ejendom inkl. stamdata, en vejledning til hvordan man læser bygnigsdelskortene og en opsummeret tilstandsoversigt. Herefter præsenteres du for alle bygningsdelskortene, som er fundamentet i vedligeholdelsesplanen.</p>
    <br />

    <p>Til sidst er der udarbejdet et 10-års vedligeholdelsesbudget på baggrund af de anskuede arbejdsopgaver og erfaringspriser, som er beskrevet i bygningsdelskortene. I forlængelse af budgettet finder du en oversigt over evt. ekstra byggesagsudgifter.</p>
    <br />

    <h3 className="text-lg font-semibold text-black ">Den digitale vedligeholdelsesplan i Upsite</h3>

    <p>Du kan også tilgå vedligeholdelsesplanen digitalt på platformen Upsite og få overblik over ejendommens tilstand og planlagte vedligehold i realtid. I Upsite kan du løbende holde vedligeholdelsesplanen opdateret, og der er derudover også mulighed for at se flere ejendomsdata.</p>
    <br />

    <p>Se mere på <a className="text-green underline" href="https://upsiteapp.com">upsiteapp.com</a></p>
  </>
}