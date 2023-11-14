// 3rd party libraries
import { useMutation, useQuery } from '@tanstack/react-query';

// Workspace libraries
import { CreateRealEstateDTOJSON } from '@project/shared/feature-real-estates/interfaces/dtos/create-real-estate-dto.type'
import { RealEstateJSON } from '@project/shared/feature-real-estates/interfaces/real-estate.interface';
import apiClient from '@thor-frontend/common/api-client';



export const createRealEstate = (dto: CreateRealEstateDTOJSON) => {
  return apiClient.post<{ realEstate: RealEstateJSON }>(`real-estates`, dto);
};

export const useCreateRealEstate = (dto: CreateRealEstateDTOJSON) => {
  return useQuery(
    ['real-estates', 'create', dto],
    () => createRealEstate(dto).then((x) => x.data),
    {
      enabled: !!(dto.addressId),
    }
  );
};

export const useCreateRealEstatesAsync = () => {
  return useMutation({
    mutationFn: (dto: CreateRealEstateDTOJSON) =>
      createRealEstate(dto).then((x) => {
        return x.data;
      }),
  });
};
