// 3rd party libraries
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { formatDate } from '@project/shared/common/utils/format-date.util';
import { usePathParamV2 } from '@project/ui';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import { useCloneMaintenancePlanVersion } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-clone-by-id';
import { useEditableMaintenancePlan } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-editable';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useActiveMLNSectionStore } from '@thor-frontend/features/maintenance-plan-versions/store/active_mln_section.store';



export type IMaintenancePlanLiveNavigationProps = {
  setShowVersionsModal: (val: boolean) => void;
  setShowUpdateModal: (val: boolean) => void;
  menuItems: string[];
  handleClick: (item: string) => void;
};

/**
 * Component description
 */
export const MaintenancePlanLiveNavigation: React.FC<
  IMaintenancePlanLiveNavigationProps
> = (props) => {
  // Params
  const [realEstateId] = usePathParamV2('id');
  const [planId] = usePathParamV2('planId');

  // State
  const [currentNavItem, setCurrentNavItem] = useState<string>(
    'Ejendomsbeskrivelse'
  );

  // Hooks
  const editableMaintenancePlan = useEditableMaintenancePlan(realEstateId);
  const maintenancePlan = useMaintenancePlanVersionById(planId);
  const history = useHistory();
  const cloneMaintenancePlanVersionAsync = useCloneMaintenancePlanVersion();

  const normalMenuClass =
    'py-2 px-3 mr-3 cursor-pointer text-neutral-500 rounded-xl hover:text-pine hover:bg-pine/5 font-medium';
  const activeClass = 'text-pine bg-pine/5';
  const useActiveMLNSection = useActiveMLNSectionStore();

  // Use Effects
  useEffect(() => {
    if (useActiveMLNSection.activeSections.length > 0) {
      for (const menu of props.menuItems) {
        if (useActiveMLNSection.activeSections.includes(menu)) {
          setCurrentNavItem(menu);
          break;
        }
      }
    }
  }, [useActiveMLNSection.activeSections, props.menuItems]);

  React.useEffect(() => {
    editableMaintenancePlan.refetch();
    maintenancePlan.refetch();
  }, []);

  //Functions

  const handleStickyNavClick = (id: string) => {
    setCurrentNavItem(id);
    props.handleClick(id);
  };

  const NavMenuItem = (text: string) => {
    return (
      <div
        key={`mpln-${text}`}
        onClick={() => handleStickyNavClick(text)}
        className={classNames(
          normalMenuClass,
          currentNavItem === text ? activeClass : ''
        )}
      >
        {text}
      </div>
    );
  };

  // Variables
  const loading =
    maintenancePlan.isFetching || editableMaintenancePlan.isFetching;

  const versionDate = maintenancePlan.data
    ? new Date(maintenancePlan.data.publishedAt ?? maintenancePlan.data.createdAt)
    : new Date();

  const hasEditable = !!editableMaintenancePlan.data;

  const updateBtnText = hasEditable ? 'Fortsæt kladde' : 'Opdater';

  return (
    <div className="flex w-full py-4 px-8 sticky top-[80px] z-10 bg-white border-b border-t mb-8">
      {/* Nav Items */}
      {props.menuItems.map((item) => NavMenuItem(item))}

      {/* Buttons */}
      <div className="flex grow justify-end">
        <UpsiteButton
          onClick={() => {
            props.setShowVersionsModal(true);
          }}
          type="secondary"
          isLoading={loading}
          className="mr-2"
        ><i className="text-xl ri-history-line" /> {`Version: ${formatDate(versionDate, 'DD-MM-YYYY')}`}</UpsiteButton>
        <UpsiteButton onClick={() => {
          if (hasEditable) {
            console.log('Har kladde');
            const url = history.location.pathname.split('/').slice(0, -2);
            url.push(editableMaintenancePlan.data._id);
            url.push('kladde');
            const finalUrl = url.join('/');
            history.replace(finalUrl);
          } else {
            console.log('Open Modal');
            props.setShowUpdateModal(true);
          }
        }} isLoading={loading}><i className="text-xl ri-edit-line" /> {updateBtnText}</UpsiteButton>
      </div>
    </div>
  );
};
