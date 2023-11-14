// 3rd party libraries
import { useMutation, useQuery } from '@tanstack/react-query';

// Workspace libraries
import { SparseRealEstateJSON } from '@project/shared/feature-real-estates/projections/sparse-real-estate.projection';
import apiClient from '@thor-frontend/common/api-client';



// fetcher (add resource type here, eg 'apiClient.get<IUser[]>')
export const getRealEstateByAddress = (addressString: string) =>
  apiClient.get<SparseRealEstateJSON>(
    `/real-estates/by-address/${addressString}`
  );

// key
const key = (addressString: string) => [
  `real-estates`,
  'by-address',
  addressString,
];

// query
export const useRealEstateByAddress = (addressString: string) => {
  return useQuery(
    key(addressString),
    () =>
      getRealEstateByAddress(addressString).then((response) => response.data),
    {
      // options
      enabled: addressString != null && addressString !== '', // prevent fetching when required param is missing
      // placeholderData: [], // used as .data until fetch is complete
    }
  );
};

export const useRealEstateByAddressAsync = () => {
  return useMutation({
    mutationFn: (addressString: string) =>
      getRealEstateByAddress(addressString).then((x) => {
        return x.data;
      }),
  });
};

// make query key accessible
useRealEstateByAddress.key = key;
