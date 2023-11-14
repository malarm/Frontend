// 3rd party libraries
import { Link } from 'react-router-dom';
import { BarChart, Bar, YAxis, ResponsiveContainer, CartesianGrid, XAxis, ReferenceLine, Tooltip, } from 'recharts';
import { useState } from 'react';

// Workspace libraries
import { usePathParamV2, useResizeObserver } from '@project/ui/hooks';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';
import { useLiveMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-live';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import { useRealEstateBudgetById } from '@thor-frontend/features/real-estate-budgets/queries/real-estate-budget-by-id';
import { capitalize } from '@project/shared/common/utils/capitalize.util'
import { humanWorkTaskType } from '@project/shared/feature-work-tasks/utils/human-work-task-type.util'
import { range } from '@project/shared/common/utils/range.util'
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { Amount, formatNumber, } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { DashboardMetric } from '@thor-frontend/features/real-estates/components/dashboard-metric';
import { getEnergyLabelIcon } from '@thor-frontend/features/real-estates/utils/get-energy-label-icon.util';
import { Infobox } from '@thor-frontend/common/infobox/infobox';

// Application
import './overblik.css'
import { StaticMap } from '@thor-frontend/common/static-map/static-map';



const Overblik = () => {
  const [realEstateId] = usePathParamV2('id');
  const realEstateQuery = useRealEstateById(realEstateId);
  const planQuery = useLiveMaintenancePlan(realEstateId);
  const budgetQuery = useRealEstateBudgetById(
    planQuery.data?.realEstateBudgetId
  );

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


  const isLoading =
    [realEstateQuery, planQuery, budgetQuery].some(
      (x) => x.status === 'loading'
    ) && !planQuery.error;
  // plan query will 404 if no plan is published yet (in this case, 'planQuery.error' is defined)

  const content = () => {
    if (isLoading) {
      return (
        <div className="grid place-content-center h-full min-h-[500px]">
          <UpsiteLogoLoader />
        </div>
      );
    }

    const realEstate = realEstateQuery.data;
    const plan = planQuery.data;
    const budget = budgetQuery.data;

    if (!realEstate) {
      return (
        <div className="grid place-content-center h-full min-h-[500px]">
          <UpsiteLogoLoader />
        </div>
      );
    }

    const labelClassificationsWithYears: Array<{
      classification: string;
      year: string;
    }> = realEstate.energyLabelClassification
        ? realEstate.energyLabelClassification
          .split(/\s*\/\s*/g)
          .map((classification) => ({
            classification,
            year: realEstate.energyLabelValidFrom
              ? new Date(realEstate.energyLabelValidFrom)
                .getFullYear()
                .toString()
              : '----',
          }))
        : [];

    const years: number[] = budget
      ? range(
        budget.value.startYear,
        budget.value.startYear + budget.value.numberOfYears - 1
      )
      : [];



    const chartData: Array<{
      year: number;
      improvement: number;
      maintenance: number;
      operating: number;
      uncategorized: number;
    }> =
      budget && budget.value.expensesByWorkTaskType
        ? years.map((year, index) => {
          return {
            year,
            improvement:
              budget.value.expensesByWorkTaskType.improvement.expensesByYear[
              index
              ],
            operating:
              budget.value.expensesByWorkTaskType.operating.expensesByYear[
              index
              ],
            maintenance:
              budget.value.expensesByWorkTaskType.maintenance.expensesByYear[
              index
              ],
            uncategorized:
              budget.value.expensesByWorkTaskType.uncategorized
                .expensesByYear[index],
          };
        })
        : [];

    const avgYearlyExpense = budget
      ? budget.value.totalExMomsRow.totalExpenses / budget.value.numberOfYears
      : 0;

    const avgYearlyExpenseOverArea = () => {
      if (!budget) return 0;

      return Math.round(budget.value.totalOverAreaRow.totalExpenses / budget.value.numberOfYears)
    }

    const addressUsed = realEstate.addressString ?? realEstate.unionName;

    return (
      <div className="flex flex-col gap-8">
        {/* map and stam data */}
        <div className="grid grid-cols-2 auto-cols-fr gap-8">
          <div ref={imageContainerRef} className="rounded-xl w-full h-full relative">

            <StaticMap
              address={addressUsed}
              mapOptions={{
                zoom: 18,
                size: `${Math.round(imgWidth)}x${Math.round(imgHeight)}`,
                markers: addressUsed
              }}
              imageProps={{
                className: 'absolute inset-0 rounded-xl w-full h-full',
                imgClassName: 'object-cover absolute inset-0 rounded-xl w-full h-full'
              }}
            />

            <div className="absolute top-4 right-4">
              <div className="flex flex-row gap-2">
                {labelClassificationsWithYears.map(
                  ({ classification, year }) => {
                    const Icon = getEnergyLabelIcon(classification);

                    return <Icon className="w-14 h-14" />;
                  }
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl text-black mb-2">Stamdata</h2>

            {[
              ['Ejendomsnavn', realEstate.unionName],
              ['Kommune', [
                realEstate.zipcode,
                realEstate.municipality
              ].filter(x => x).join(' ')],
              [
                'Opførselsår',
                realEstate.buildDate
                  ? new Date(realEstate.buildDate).getFullYear()
                  : 'ukendt',
              ],
            ].map(([key, value]) => (
              <div className="flex flex-row justify-between gap-2 py-4 border-b border-slate">
                <p className="text-neutral-500">{key}</p>
                <p className="text-right">{value}</p>
              </div>
            ))}

            <Link
              to={`${ThorPaths.EJENDOMME}/${realEstateId}/stamdata`}
              className="text-black underline mt-6 font-medium"
            >
              Se alle stamdata
            </Link>
          </div>
        </div>

        {/* no plan published disclaimer */}
        {!plan ? (

          <Infobox>
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
        ) : (
          ''
        )}

        {/* summary numbers (nøgletal) */}
        <h2 className="text-black text-xl">Nøgletal</h2>
        <div className="grid grid-cols-3 auto-cols-fr gap-4">
          {/* samlede vedl.udgifter */}
          <DashboardMetric
            label={'Samlede vedligeholdelsesudgifter'}
            value={budget ? budget.value.totalInclMomsRow.totalExpenses : 0}
          />

          <DashboardMetric
            label={'Gns. vedligeholdelsesudgifter pr. m² pr. år'}
            value={avgYearlyExpenseOverArea()}
          />

          <div className="p-6 rounded-xl bg-neutral-100 flex flex-col gap-4 relative">
            <p className="absolute top-2 right-2 bg-black text-white text-sm font-medium px-2 rounded leading-6">
              Kommer snart
            </p>

            <p className="text-6xl opacity-50">
              <Amount className="text-4xl" prefix={''} amount={0}>
                {' '}
                kg.
              </Amount>
            </p>
            <p className="text-black text-sm opacity-50">
              Samlet CO2 udledning pr. m²
            </p>
          </div>
        </div>

        {/* chart */}
        <div></div>

        {!budget ? (
          ''
        ) : (
          <>
            <div className="flex flex-row justify-between">
              <h2 className="text-black text-xl">
                Fordeling af vedligeholdelsesudgifter
              </h2>

              {/* legend */}
              <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center gap-1">
                  <div className="w-3 h-3 bg-pine"></div>
                  <p className="text-neutral-500 text-xs font-medium">
                    Vedligehold
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div className="w-3 h-3 bg-slate"></div>
                  <p className="text-neutral-500 text-xs font-medium">Drift</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div className="w-3 h-3 bg-green"></div>
                  <p className="text-neutral-500 text-xs font-medium">
                    Forbedringer
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <p className="text-neutral-500 text-xs font-medium">
                    -- Gns. kr. pr. år
                  </p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width={'100%'} height={250}>
              <BarChart data={chartData} barSize={8}>
                <YAxis
                  scale={'auto'}
                  className="text-xs font-medium"
                  axisLine={false}
                  unit=" kr."
                  width={100}
                  tickFormatter={(tick) => formatNumber(tick as number)}
                />

                <XAxis className="text-xs font-medium" dataKey={'year'} />

                <CartesianGrid vertical={false} />

                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                  isAnimationActive={false}
                  formatter={(value, name, props) => [
                    formatNumber(value as number),
                    capitalize(humanWorkTaskType(name as WorkTaskType)),
                  ]}
                  content={(props) => {
                    if (props.payload.length === 0) return null;

                    const year = props.payload[0].payload['year'];

                    const expenses = props.payload.map((x) => ({
                      name: capitalize(
                        humanWorkTaskType(x.dataKey as WorkTaskType)
                      ),
                      value: formatNumber(x.value as number),
                      color: x.color,
                    }));

                    return (
                      <div className="bg-white p-2 rounded-lg border-slate min-w-[180px] border">
                        <p className="text-xs text-neutral-500 mb-1">{year}</p>

                        <div>
                          {expenses.map(({ name, value, color }) => (
                            <div className="flex flex-row justify-between gap-4">
                              <p className="text-xs text-black whitespace-nowrap flex flex-row gap-1 items-center">
                                <div
                                  className="w-2 h-2"
                                  style={{ backgroundColor: color }}
                                ></div>
                                {name}
                              </p>
                              <p className="text-xs font-medium  text-black whitespace-nowrap">
                                {value} kr.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                {/* Vedligehold */}
                <Bar
                  dataKey={WorkTaskType.Maintenance}
                  fill="#005032" // pine
                  unit="kr."
                  stackId={1}
                />
                {/* Drift */}
                <Bar
                  dataKey={WorkTaskType.Operating}
                  fill="#E5E5E5" // slate
                  unit="kr."
                  stackId={1}
                />


                {/* Forbedringer */}
                <Bar
                  dataKey={WorkTaskType.Improvement}
                  fill="#28D769" // green
                  unit="kr."
                  stackId={1}
                />


                {/* Årlige gennemsnit */}
                {/* stroke: neutral-500 */}
                <ReferenceLine
                  y={avgYearlyExpense}
                  stroke="#737373"
                  strokeDasharray="3 3"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    );
  };

  return (
    <RealEstateSubPage title="Overblik">
      <div className="px-8 pb-32 h3">{content()}</div>
    </RealEstateSubPage>
  );
};

export default Overblik;
