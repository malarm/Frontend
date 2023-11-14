// Workspace libraries
import { RealEstateSummaryJSON } from '@project/shared/feature-real-estates/projections/real-estate-summary.projection'



export const realEstateTestData = (): RealEstateSummaryJSON[] => [
  {
    _id: '647da4b7336c6ef5aea839f9',
    energyLabelClassification: 'A',
    municipality: 'København NV',
    zipcode: "2400",
    unionName: 'A/B Tomsgårdhuse',
    maintenancePlanPublishedAt: '2022-05-01T13:15:00.000Z',
    yearlyExpensesOverArea: 101.76,
    isLocked: false
  },
  {
    _id: '647da4b7336c6ef5aea839fa',
    energyLabelClassification: 'C/D',
    municipality: 'København N',
    zipcode: "2200",
    unionName: 'A/B Brynhilde',
    yearlyExpensesOverArea: 51.3,
    isLocked: false
  },
  {
    _id: '647da4b7336c6ef5aea839fd',
    energyLabelClassification: 'F',
    municipality: 'København N',
    zipcode: "2200",
    unionName: 'A/B Sankt Hans Torv 30/Nørre Allé 1',
    isLocked: false
  },
  {
    _id: '647da4b7336c6ef5aea839fd',
    unionName: "E/F Vangedevej 232 A-C",
    municipality: "Dyssegård",
    zipcode: "2870",
    isLocked: false,
  }
]