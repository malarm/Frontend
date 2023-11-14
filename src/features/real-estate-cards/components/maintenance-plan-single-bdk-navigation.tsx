// 3rd party libraries
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import { DropDownCardV2, useDropdown, usePathParamV2, } from '@project/ui';
import { getId } from '@project/ui/dropdown-menu/get-id';
import { UpsiteButton } from '@project/ui/button/upsite-button'
import AutoSaveSpinner from '@thor-frontend/features/maintenance-plan-versions/components/auto-save-spinner';
import { useCardsByMaintenancePlanVersion } from '@thor-frontend/features/real-estate-cards/queries/cards-by-maintenance-plan-version';



interface Props {
  item: any;
  autoSaving?: boolean;
}

const MaintenancePlanSingleBDKNavigation = (props: Props) => {
  // Hooks
  const history = useHistory();
  const [planId] = usePathParamV2('planId');
  const getBDKbyVersion = useCardsByMaintenancePlanVersion(planId);
  const { currentId, setCurrentId } = useDropdown();
  const [id] = useState<number>(getId());
  const [cardIsHovered, setCardIsHovered] = useState(false);

  function openHandler(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentId(currentId != id ? id : -1);
  }

  const open = currentId === id;

  // Functions

  const findIndexInArrayOfObjects = (array: any[], id: string) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === id) {
        return i;
      }
    }
    return -1; // Return -1 if no match is found
  };

  const getNewBDKRoute = (id: string): string => {
    return `${history.location.pathname
      .split('/')
      .slice(0, -1)
      .join('/')}/${id}`;
  };

  const nextBDKHandler = () => {
    // Find Next in Array
    let index = findIndexInArrayOfObjects(getBDKbyVersion.data, props.item._id);
    // If End of Array go to start
    if (index + 1 === getBDKbyVersion.data.length) {
      index = 0;
    } else {
      index++;
    }
    history.push(getNewBDKRoute(getBDKbyVersion.data[index]._id));
  };

  const previousBDKHandler = () => {
    // Find Previous in Array
    let index = findIndexInArrayOfObjects(getBDKbyVersion.data, props.item._id);
    // If Start of Array go to End
    if (index === 0) {
      index = getBDKbyVersion.data.length - 1;
    } else {
      index--;
    }
    history.push(getNewBDKRoute(getBDKbyVersion.data[index]._id));
  };

  const goBack = () => {
    const route = history.location.pathname.split('/').slice(0, -1).join('/');
    history.push(route);
  };

  const dropdownItems = () => {
    return getBDKbyVersion.data.map((x) => {
      return {
        title: `${x.number.toString().padStart(2, '0')} ${x.name}`,
        action: () => history.push(getNewBDKRoute(x._id)),
      };
    });
  };
  return (
    <div className="border-slate-200 border-b sticky top-0 bg-white z-50">
      {/* Navigation */}
      <div className="flex justify-between py-4 max-w-full w-[1120px] mx-auto my-0 px-4">
        <div className="flex w-1/3  gap-2 items-center">
          <UpsiteButton onClick={goBack} type="secondary"><i className="text-xl ri-arrow-left-line" /> Oversigt</UpsiteButton>
          <AutoSaveSpinner loading={props.autoSaving} />
        </div>

        <div
          onClick={(e) => openHandler(e)}
          className="flex min-w-[300px] cursor-pointer px-4 rounded hover:bg-neutral-50 relative w-1/3 "
        >
          <div className='mx-auto flex'>
            <p className="text-black text-xl font-medium mt-1.5">
              {props.item?.number.toString().padStart(2, '0')} {props.item?.name}
            </p>
            <i className="ri-expand-up-down-line text-2xl mt-1 ml-2"></i>
            <DropDownCardV2
              data={dropdownItems()}
              setOpen={(isOpen) =>
                !isOpen ? setCurrentId(-1) : setCurrentId(id)
              }
              open={open}
              align={'left'}
              onHoverStateChange={setCardIsHovered}
              className="absolute top-12 !w-full max-h-72 overflow-y-scroll"
            />
          </div>
        </div>
        <div className="flex w-1/3 justify-end">
          <UpsiteButton
            onClick={previousBDKHandler}
            type="secondary"
            className="mr-2"
          ><i className="text-xl ri-arrow-left-line" /> </UpsiteButton>
          <UpsiteButton onClick={nextBDKHandler} type="secondary"><i className="text-xl ri-arrow-right-line" /> </UpsiteButton>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePlanSingleBDKNavigation;
