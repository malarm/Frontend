// 3rd party libraries
import React from 'react'
import { Link } from 'react-router-dom'

// Workspace libraries
import { usePathParamV2 } from '@project/ui'
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader'
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id'
import { useRealEstateBudgetById } from '@thor-frontend/features/real-estate-budgets/queries/real-estate-budget-by-id'
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id'
import { Ipsum, PageBreak, Printable, SectionHeader } from '@project/ui/printable'
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user'
import { useOrganization } from '@thor-frontend/features/organizations/queries'
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id'
import { useFullCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/full-cards-by-maintenance-plan-version'
import { IntroductionPage, DescriptionPage, FrontPage, BDKOverviewPage, Watermark } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages'
import { RichText } from '@project/ui/rich-text'
import { BDKReadingGuidePage } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages/bdk-reading-guide-page'
import { RealEstateCardPage } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages/real-estate-card-page'
import { TenYearBudgetPageA } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages/ten-year-budget-page-a'
import { TenYearBudgetPageB } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages/ten-year-budget-page-b'
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { IconsUpsite } from '@thor-frontend/assets/svg'
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { SupportMail } from '@thor-frontend/common/support-mail/support-mail'
import { PrioritizationPage } from '@thor-frontend/features/maintenance-plan-versions/components/printable-pages/prioritization-page'



export type IMaintenancePlanVersionPrintableProps = {
  // 
}

/**
 * Component description
 */
export const MaintenancePlanVersionPrintable: React.FC<IMaintenancePlanVersionPrintableProps> = (props) => {

  const [maintenancePlanVersionId] = usePathParamV2('maintenancePlanVersionId')

  const maintenancePlanVersionQuery = useMaintenancePlanVersionById(maintenancePlanVersionId)

  const realEstateId = maintenancePlanVersionQuery.data?.realEstateId
  const organizationId = useOrganizationId()

  const realEstateBudgetId = maintenancePlanVersionQuery.data?.realEstateBudgetId

  const realEstateQuery = useRealEstateById(realEstateId)
  const realEstateBudgetQuery = useRealEstateBudgetById(realEstateBudgetId)
  const realEstateCardsQuery = useFullCardsByMaintenancePlanVersion(maintenancePlanVersionId)
  const currentUserQuery = useCurrentUser()
  const organizationQuery = useOrganization(organizationId)

  const queries = [
    maintenancePlanVersionQuery,
    realEstateQuery,
    realEstateBudgetQuery,
    realEstateCardsQuery,
    currentUserQuery
  ]


  const isLoading = queries.some(x => x.status === 'loading' && x.isFetching)

  const dataIsMissing = queries.some(x => !x.data)

  const realEstate = realEstateQuery.data
  const realEstateBudget = realEstateBudgetQuery.data
  const realEstateCards = realEstateCardsQuery.data
  const plan = maintenancePlanVersionQuery.data
  const user = currentUserQuery.data
  const organization = organizationQuery.data


  if (isLoading) {
    return <div className="w-screen h-screen grid place-content-center grid-flow-row gap-4">
      <UpsiteLogoLoader widthPx={150} heightPx={150} />
    </div>
  }

  if (dataIsMissing) {
    // console.log('QUeries with no data:', queries.filter(x => !x.data).map(x => x.))

    return <div className="w-screen h-screen grid place-content-center grid-flow-row gap-4">
      <p className="text-5xl">Fejl</p>
      <p className="text-xl max-w-[400px]">Data til generering kunne ikke indhentes. Dette kan skyldes nedetid. Fortsætter fejlen, kontakt <SupportMail />.</p>
      <Link className="w-max" to={ThorPaths.EJENDOMME}>
        <UpsiteButton>Tilbage til Upsite</UpsiteButton>
      </Link>
    </div>
  }

  const publisher = plan?.publisher ?? user

  const frontPageImage = realEstate.bannerImage
    ?? realEstateCards.find(x => x.pictures && x.pictures.length > 0)?.pictures?.[0]


  return <Printable
    watermark={plan.state === 'editable' ? <Watermark /> : ''}
    Header={(props) => <div className="text-neutral-500 text-sm">Vedligeholdelsesplan | {realEstate.unionName}</div>}
    Footer={({ pageIndex, totalPages }) => <div className="text-right text-sm text-neutral-500">{pageIndex} / {totalPages}</div>}
  >
    <FrontPage
      unionName={realEstate.unionName}
      addressString={realEstate.addressString}
      publisher={publisher}
      publishedAt={plan.publishedAt}
      logo={organization?.logo}
      image={frontPageImage}
      organizationName={organization?.name ?? 'Upsite'}
    />

    {/* Introduction til VP */}
    <IntroductionPage
      unionName={realEstate.unionName}
    />

    <PageBreak />


    {/* conclusion */}
    <SectionHeader sectionName={'conclusion'}>Konklusion på ejendommens tilstand</SectionHeader>

    <RichText
      content={plan.conclusion}
    />

    <PageBreak />

    <PrioritizationPage
      startYear={realEstateBudget.value.startYear}
      realEstateCards={realEstateCards}
      indexRegulation={realEstate.indexreg ?? 1}
    />

    <PageBreak />

    <DescriptionPage
      bbrData={plan.BBRData}
      description={plan.realEstateDescription}
    />

    <PageBreak />

    <BDKReadingGuidePage />

    <PageBreak />

    <BDKOverviewPage cards={realEstateCards} />

    <PageBreak />

    {realEstateCards.map(realEstateCard => {

      return <>
        <RealEstateCardPage
          realEstateCard={realEstateCard}
          indexRegulation={realEstate.indexreg ?? 1}
        />
        <PageBreak />
      </>
    })}

    <TenYearBudgetPageA
      realEstateBudget={realEstateBudget.value}
      unionName={realEstate.unionName}
    />

    <PageBreak />

    <TenYearBudgetPageB
      realEstateBudget={realEstateBudget.value}
      unionName={realEstate.unionName}
      area={plan.BBRData.totalArea?.toString() ?? ''}
    />

  </Printable>
}