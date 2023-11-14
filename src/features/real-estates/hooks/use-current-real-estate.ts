// Workspace libraries
import { useRealEstateId } from '@thor-frontend/features/real-estates/hooks/use-real-estate-id';
import { useRealEstateById } from '@thor-frontend/features/real-estates/queries/real-estate-by-id';



/**
 * Combines the ``useRealEstateId`` hook and ``useRealEstateById`` query
 *
 * @returns
 */
export const useCurrentRealEstate = () => {
  const realEstateId = useRealEstateId();

  return useRealEstateById(realEstateId);
};
