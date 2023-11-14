// 3rd party libraries
import { Link } from 'react-router-dom';

// Workspace libraries
import { usePathParamV2 } from '@project/ui/hooks';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { useNewestEnergyLabelByRealEstate } from '@thor-frontend/features/energy-labels/queries/newest-energy-label-by-real-estate';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import { Infobox } from '@thor-frontend/common/infobox/infobox';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { FileButton } from '@thor-frontend/common/files/file-button';
import { useDownloadFile } from '@thor-frontend/common/files/use-download-file';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { useDownloadApiFile } from '@thor-frontend/common/files/use-download-api-file';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { toSlug } from '@project/shared/common';
import { useOrganizationId } from '@thor-frontend/common/hooks/use-organization-id';
import { useOrganizationHasType } from '@thor-frontend/features/organizations/hooks/use-organization-has-type';
import { useOrganizationHasSubscription } from '@thor-frontend/features/organizations/hooks/use-organization-has-subscription';
import { disabledProps } from '@project/ui/common/utils/disabled-props.util'



const Reports = () => {
  const [realEstateId] = usePathParamV2('id');

  const organizationId = useOrganizationId()

  const liveMaintenancePlanVersionQuery = useLiveMaintenancePlan(realEstateId)
  const energyLabelQuery = useNewestEnergyLabelByRealEstate(realEstateId)
  const realEstateQuery = useRealEstateById(realEstateId)

  const {
    result: isPartner,
    isLoading: partnerIsLoading
  } = useOrganizationHasType()

  const {
    result: hasPaidSubscription,
    isLoading: subscriptionIsLoading,
  } = useOrganizationHasSubscription()

  const hasPlan = !!liveMaintenancePlanVersionQuery.data
  const hasExcelAccess = isPartner || hasPaidSubscription

  const isLoading = [
    liveMaintenancePlanVersionQuery,
    energyLabelQuery,
  ].some(x => x.status === 'loading') || partnerIsLoading || subscriptionIsLoading;

  const pdf = liveMaintenancePlanVersionQuery.data?.maintenancePlanPDF
  const energyLabel = energyLabelQuery.data
  const hasBudget = !!liveMaintenancePlanVersionQuery.data?.realEstateBudgetId

  console.log({
    hasBudget,
    hasExcelAccess
  })

  const {
    downloadFile: downloadVP,
    isLoading: vpIsLoading
  } = useDownloadFile({
    key: pdf?.awsMetadata?.Key,
    fileName: 'vedligeholdelsesplan.pdf'
  })

  const {
    downloadFile: downloadEnergyLabel,
    isLoading: energyLabelIsLoading,
  } = useDownloadFile({
    key: energyLabel?.awsMetadata?.Key,
    fileName: 'energimaerke.pdf'
  })

  const {
    downloadFile: downloadTenYearExcel,
    isLoading: tenYearExcelIsLoading
  } = useDownloadApiFile({
    path: `/excel/${liveMaintenancePlanVersionQuery.data?._id}/ten-year-budget`,
    mimetype: 'application/vnd.ms-excel',
    fileName: `${toSlug(realEstateQuery.data?.unionName ?? '')}-10-aars-budget.xlsx`
  })

  const {
    downloadFile: downloadPrioritizedBudgetExcel,
    isLoading: prioritizedBudgetExcelIsLoading
  } = useDownloadApiFile({
    path: `/excel/${liveMaintenancePlanVersionQuery.data?._id}/prioritized-budget`,
    mimetype: 'application/vnd.ms-excel',
    fileName: `${toSlug(realEstateQuery.data?.unionName ?? '')}-prioriteret-budget.xlsx`
  })

  const {
    downloadFile: downloadConstructionBudgetExcel,
    isLoading: constructionBudgetExcelIsLoading
  } = useDownloadApiFile({
    path: `/excel/${liveMaintenancePlanVersionQuery.data?._id}/construction-budget`,
    mimetype: 'application/vnd.ms-excel',
    fileName: `${toSlug(realEstateQuery.data?.unionName ?? '')}-byggebudget.xlsx`
  })

  const buttonDisabledProps = {
    ...disabledProps(
      [!hasPlan, 'Der er endnu ikke udgivet en vedligeholdelsesplan på ejendommen'],
      [!hasBudget, 'Der er ikke noget budget tilgængeligt for vedligeholdelsesplanen. Refresh din browser, og kontakt os hvis problemet fortsætter'],
      [!hasExcelAccess, 'Denne funktion kræver Upsite Essential.']
    )
  }


  const renderInfoBox = () => {

    if (!liveMaintenancePlanVersionQuery.data) {
      return <Infobox>
        <p>
          Der er endnu ikke oprettet en vedligeholdelsesplan på ejendommen.{' '}
          <Link
            to={`${ThorPaths.EJENDOMME}/${realEstateId}/vedligehold`}
            className="text-black underline font-medium"
          >
            Klik her for at komme i gang
          </Link>
        </p>
      </Infobox>
    }

    return ''
  }

  const content = () => {

    if (isLoading) {
      return <div className='grid place-content-center w-full h-full min-h-[500px]'>
        <UpsiteLogoLoader />
      </div>
    }


    return <>
      {/* infobox */}
      {renderInfoBox()}

      <div className="grid grid-flow-col columns-2 auto-cols-fr gap-4">

        <div className="p-6 rounded-xl bg-neutral-100">
          <h3 className="text-lg text-black">PDF rapporter</h3>
          <div className="flex flex-col gap-2 mt-5">

            {/* vp pdf */}
            <FileButton
              onClick={() => {
                if (!pdf) {
                  window.open(
                    window.location.origin + ThorPaths.MAINTENANCE_PLAN_VIEW + '/' + liveMaintenancePlanVersionQuery.data?._id,
                    '_blank'
                  )
                  return;
                }
                downloadVP()
              }}
              isDisabled={!liveMaintenancePlanVersionQuery.data}
              disabledText='Ejendommen har endnu ikke nogen vedligeholdelsesplan'
              actionIconClassName='ri-download-line text-2xl text-black'
              isLoading={liveMaintenancePlanVersionQuery.status === 'loading' || vpIsLoading}
            >Vedligeholdelsesplan.pdf</FileButton>

            {/* energimærke */}
            <FileButton
              onClick={downloadEnergyLabel}
              isDisabled={!energyLabel}
              disabledText='Der er ikke noget energimærke tilgængeligt på ejendommen'
              actionIconClassName='ri-download-line text-2xl text-black'
              isLoading={energyLabelIsLoading}
            >Energimærke.pdf</FileButton>

          </div>
        </div>

        <div className="p-6 rounded-xl bg-neutral-100 flex flex-col relative">
          <h3 className="text-lg text-black">Excel budgetter</h3>

          <div className="flex flex-col gap-2 mt-5">
            {/* 10 års */}
            <FileButton
              onClick={downloadTenYearExcel}
              {...buttonDisabledProps}
              actionIconClassName='ri-download-line text-2xl text-black'
              fileIconClassName='ri-file-excel-line text-green text-xl'
              isLoading={tenYearExcelIsLoading}
            >10aar-budget.xls</FileButton>

            {/* prioriteret */}
            <FileButton
              onClick={downloadPrioritizedBudgetExcel}
              {...buttonDisabledProps}
              actionIconClassName='ri-download-line text-2xl text-black'
              fileIconClassName='ri-file-excel-line text-green text-xl'
              isLoading={prioritizedBudgetExcelIsLoading}
            >Prioriteringer.xls</FileButton>

            {/* bygherre */}
            <FileButton
              onClick={downloadConstructionBudgetExcel}
              {...buttonDisabledProps}
              actionIconClassName='ri-download-line text-2xl text-black'
              fileIconClassName='ri-file-excel-line text-green text-xl'
              isLoading={constructionBudgetExcelIsLoading}
            >Bygherrebudget.xls</FileButton>
          </div>

        </div>

      </div>
    </>
  }

  return (
    <RealEstateSubPage title={`Rapporter`}>
      <div className="px-8 pb-8 flex flex-col gap-6">
        {content()}
      </div>
    </RealEstateSubPage>
  );
};

export default Reports;
