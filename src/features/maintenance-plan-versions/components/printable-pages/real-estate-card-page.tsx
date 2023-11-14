// 3rd party libraries
import React from 'react';

// Workspace libraries
import { addZero } from '@project/ui/utils';
import { capitalize } from '@project/shared/common/utils/capitalize.util'
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { getWorkTaskExpense } from '@project/shared/feature-real-estate-budgets/utils/get-work-task-expense.util'
import { MEDocumentJSON } from '@project/shared/feature-me-document/interfaces/me-document.interface'
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type';
import { PageBreak, SectionHeader, SectionHeaderNoContent, } from '@project/ui/printable';
import { RichText } from '@project/ui/rich-text/rich-text';
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image';
import { ThorTable } from '@thor-frontend/common/thor-table/thor-table';
import { getDocumentUrl } from '@thor-frontend/common/utils';
import { ConditionItemV2 } from '@thor-frontend/features/real-estate-cards/components/condition-item-v2';
import { Amount } from '@thor-frontend/features/real-estate-cards/components/details-sections/postings-table/amount';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { Comparators, sort_v2 } from '@project/shared/common';



export type IRealEstateCardPageProps = {
  realEstateCard: RealEstateCardJSON;
  indexRegulation: number;
};

/**
 * Component description
 */
export const RealEstateCardPage: React.FC<IRealEstateCardPageProps> = (
  props
) => {
  const { indexRegulation, realEstateCard } = props;

  const sectionSlug = `${addZero(realEstateCard.number)}-${realEstateCard.name
    .toLowerCase()
    .replace(/\s+/g, '-')}`;
  const sectionName = `${addZero(realEstateCard.number)} ${capitalize(
    realEstateCard.name
  )}`;

  const requiresScaffolding = realEstateCard.workTasks.some(
    (x) => x.requiresScaffolding
  );

  const picturesPerRow = 2;

  const pictures = realEstateCard.pictures.filter(
    x => realEstateCard.enabledPictures.some(y => x._id === y)
  )

  const pictureRows = pictures.reduce((acc, cur) => {
    if (acc.length === 0) {
      acc[0] = [];
    }

    let accHead = acc[acc.length - 1];

    if (accHead.length >= picturesPerRow) {
      acc.push([]);
      accHead = acc[acc.length - 1];
    }

    accHead.push(cur);

    return acc;
  }, [] as MEDocumentJSON[][]);

  return (
    <>
      <SectionHeaderNoContent
        sectionName={sectionSlug}
        sectionTitle={sectionName}
      ></SectionHeaderNoContent>

      {/* header, condition and meta */}
      <div className="grid grid-flow-col justify-between items-start">
        <h1 className="text-3xl mb-5">{sectionName}</h1>

        <div className="flex flex-row gap-4 items-center">
          {/* headers */}
          <div className="flex flex-col gap-2">
            <p className="text-black font-semibold">Sidst opdateret</p>
            <p className="text-black font-semibold">Stillads/lift</p>
          </div>

          {/* values */}
          <div className="flex flex-col gap-2">
            <p className="">
              {formatDate(new Date(realEstateCard.updatedAt), 'DD-MM-YYYY')}
            </p>
            <p className="">{requiresScaffolding ? 'Ja' : 'Nej'}</p>
          </div>

          {/* condition icon */}
          <ConditionItemV2
            sizeClassName="w-[42px] h-[42px] ml-4"
            condition={realEstateCard.operationInformation.condition}
          />
        </div>
      </div>

      {/* description */}
      <div
        className="grid grid-flow-col gap-6 mt-9"
        style={{ gridTemplateColumns: 'max-content 1fr' }}
      >
        <p className="text-black font-semibold">Beskrivelse</p>
        <RichText content={realEstateCard.extentDescriptionRich} />
      </div>

      {/* maintenance description */}
      <div
        className="grid grid-flow-col gap-6 mt-9"
        style={{ gridTemplateColumns: 'max-content 1fr' }}
      >
        <p className="text-black font-semibold">Vedligehold</p>
        <RichText content={realEstateCard.maintenanceDescriptionRich} />
      </div>

      {realEstateCard.workTasks.length === 0 ? (
        ''
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-black mt-9 mb-6">
            Budgetposter
          </h3>
          <ThorTable
            data={sort_v2(
              realEstateCard.workTasks,
              x => x.yearOfCompletion,
              Comparators.Number.Ascending
            )}
            thead={{
              className: 'border-b border-slate',
              th: {
                className: 'px-2 py-4 whitespace-nowrap font-bold text-black',
              },
            }}
            tbody={{
              className: 'divide-y divide-slate',
              td: {
                className: 'p-2 text-neutral-800',
              },
              tr: {
                className: 'text-sm text-neutral-500 odd:bg-neutral-100',
              },
            }}
            columns={[
              // prio år
              {
                // thClassName: () => 'pr-1 py-2 whitespace-nowrap font-bold text-black',
                header: 'Prio år.',
                cell: (workTask) => workTask.yearOfCompletion,
              },
              // type
              {
                header: 'Type',
                cell: (workTask) => (
                  <WorkTaskTypeIcon
                    className="h-5 w-5"
                    workTaskType={workTask.workTaskType}
                  />
                ),
              },

              // beskrivelse
              {
                header: 'Beskrivelse',
                cell: (workTask) => workTask.description,
              },
              // amount
              {
                thClassName: (defaultClassName) =>
                  defaultClassName + ' text-right',
                tdClassName: (item, defaultClassName) =>
                  defaultClassName + ' text-right',
                header: 'Antal',
                cell: (workTask) => workTask.amount,
              },
              // unit
              {
                thClassName: (defaultClassName) =>
                  defaultClassName + ' text-right',
                tdClassName: (item, defaultClassName) =>
                  defaultClassName + ' text-right',
                header: 'Enhed',
                cell: (workTask) => workTask.unit,
              },
              // unit price
              {
                thClassName: (defaultClassName) =>
                  defaultClassName + ' text-right',
                tdClassName: (item, defaultClassName) =>
                  defaultClassName + ' text-right',
                header: 'Enh. pris',
                cell: (workTask) => (
                  <Amount
                    className="whitespace-nowrap"
                    amount={workTask.unitPrice}
                  ></Amount>
                ),
              },

              // total
              {
                thClassName: (defaultClassName) =>
                  defaultClassName.replace(/pr-[`\s]*/, '') + ' text-right',
                tdClassName: (item, defaultClassName) =>
                  defaultClassName.replace(/pr-[`\s]*/, '') + ' text-right',
                header: 'Pris i alt',
                cell: (workTask) => (
                  <Amount
                    className="whitespace-nowrap"
                    amount={getWorkTaskExpense(props.indexRegulation)(workTask)}
                  ></Amount>
                ),
              },
            ]}
            additionalRows={({ tdProps, trProps }) => {
              const total = props.realEstateCard.workTasks
                .map((workTask) =>
                  getWorkTaskExpense(props.indexRegulation)(workTask)
                )
                .reduce((a, b) => a + b, 0);

              return (
                <tr
                  className={`${trProps.className.replace(
                    /odd:bg[^\s]+/,
                    ''
                  )} bg-pine`}
                >
                  <td
                    align={'left'}
                    colSpan={6}
                    className={`${tdProps.className} text-white`}
                  >
                    Total udgift
                  </td>
                  <td align={'right'} className={`${tdProps.className}`}>
                    <Amount
                      className="text-white"
                      amount={total}
                    ></Amount>
                  </td>
                </tr>
              );
            }}
          ></ThorTable>
        </div>
      )}

      {pictureRows.length === 0 ? (
        ''
      ) : (
        <>
          <PageBreak />

          <h3 className="text-lg font-semibold text-black mt-9 mb-2">
            Fotoregistrering
          </h3>

          {pictureRows.map((pictures) => {
            return (
              <div
                className="grid gap-4 mt-4"
                style={{
                  gridTemplateColumns: `repeat(${picturesPerRow}, 1fr)`,
                }}
              >
                {pictures.map((picture) => {
                  return <div className='flex flex-col'>
                    <ThorImage
                      src={getDocumentUrl(picture)}
                      dimensions={'480w'}
                      sizeClassName={'w-full h-full'}
                      className={' '}
                      imgClassName={'object-contain'}
                      bgClassName={'bg-transparent'}
                    />
                    {picture.meta
                      ? <>
                        <h3 className="text-lg font-semibold text-black mt-4 mb-2">
                          {picture.meta.title}
                        </h3>
                        <p>{picture.meta.description}</p>
                      </>
                      : ''}
                  </div>


                })}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};
