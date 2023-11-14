// 3rd party libraries
import { PropsWithChildren, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Workspace libraries
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { OrganizationSettingsSubRoutes } from "@thor-frontend/features/organization-settings/organizations-settings-sub-routes";



const OrganizationSettings: React.FC<PropsWithChildren> = (props) => {
  const history = useHistory()
  useEffect(() => {
    history.push(ThorPaths.SETTINGS + OrganizationSettingsSubRoutes[0].path);
  }, [history]);

  return null;
};

export default OrganizationSettings;