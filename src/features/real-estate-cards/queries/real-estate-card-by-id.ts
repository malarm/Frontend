// 3rd party libraries
import { useQuery } from '@tanstack/react-query';

// Workspace libraries
import { RealEstateCardJSON } from '@project/shared/feature-real-estate-cards/types/real-estate-cards.type';
import apiClient from '@thor-frontend/common/api-client';



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getRealEstateCardById = (realEstateCardId: string) =>
  apiClient.get<RealEstateCardJSON>(`/real-estate-cards/${realEstateCardId}`);

// key
const key = (realEstateCardId: string) => [
  `real-estate-cards`,
  realEstateCardId,
];

// query
export const useRealEstateCardById = (realEstateCardId: string) => {
  return useQuery(
    key(realEstateCardId),
    () => getRealEstateCardById(realEstateCardId).then((x) => x.data),
    {
      // options
      enabled: realEstateCardId != null, // prevent fetching when required param is missing
      // placeholderData: [], // used as .data until fetch is complete
    }
  );
};

// make query key accessible
useRealEstateCardById.key = key;
