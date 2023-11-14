// 3rd party libraries
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { RealEstateSummaryJSON } from '@project/shared/feature-real-estates/projections/real-estate-summary.projection';
import apiClient from '@thor-frontend/common/api-client';



const getRealEstatesByUser = (userId: string) =>
  apiClient.get<RealEstateSummaryJSON[]>(`/real-estates/by-user/${userId}`);

// Uncomment the code below to revert to test data
// const getRealEstatesByUser = (userId: string) => Promise.resolve({ data: realEstateTestData() })

const key = () => ['real-estates']

export const useRealEstates = (userId: string) => {
  return useQuery(
    key(),
    () => getRealEstatesByUser(userId).then((x) => x.data),
    {
      enabled: !!userId,
      placeholderData: [],
    }
  );
};

useRealEstates.key = key