// Workspace libraries
import { useRealEstates } from '@thor-frontend/features/real-estates/queries/real-estates';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { usePathParamV2 } from '@project/ui/hooks';
import RealEstateSubPage from '@thor-frontend/features/real-estates/real-estate-sub-page-layout';



const EnergyLevel = () => {
  const [realEstateId] = usePathParamV2('id');
  const userQuery = useCurrentUser();
  const realEstatesQuery = useRealEstates(userQuery.data?._id);
  const realEstates = realEstatesQuery.data.find((x) => x._id === realEstateId);

  return (
    <RealEstateSubPage title={`energimærke-${realEstates?.unionName}`}>
      <div className="p-8 h3">SubPage Content</div>
    </RealEstateSubPage>
  );
};

export default EnergyLevel;
