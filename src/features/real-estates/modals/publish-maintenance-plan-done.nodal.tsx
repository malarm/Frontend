// 3rd party libraries
import React, { } from 'react';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router-dom';

// Workspace libraries
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import MaintenancePlanButton from '@thor-frontend/features/maintenance-plan-versions/maintenance-plan-button';
import { ThorPaths } from '@project/shared/common/enums/thor-paths.enum';
import { Modal } from '@thor-frontend/common/modal/modal';
import { useMaintenancePlanVersionById } from '@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-version-by-id';
import { useDownloadFile } from '@thor-frontend/common/files/use-download-file';
import { usePathParamV2 } from '@project/ui';

// Application
import checkMarkAnimation from '../../../assets/json/upsite-checkmark.json';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmHandler: () => void;
  planId: string;
}

const PublishMaintenancePlanDoneModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // Function
  const planQuery = useMaintenancePlanVersionById(props.planId)

  const plan = planQuery.data

  const history = useHistory()

  const [realEstateId] = usePathParamV2('id')


  const {
    downloadFile,
    isLoading
  } = useDownloadFile({
    fileName: plan?.maintenancePlanPDF?.filename,
    key: plan?.maintenancePlanPDF?.awsMetadata?.Key,
    openInNewTab: true,
    mimetype: plan?.maintenancePlanPDF?.mimetype
  })

  // Return
  return (
    <Modal
      isOpen={props.isOpen}
      {...props}
      widthClassName="w-[600px]"
      colorClassName="bg-neutral-100"
    >
      {/* <div className="flex flex-col justify-center p-8 rounded-xl bg-neutral-100 w-[600px]"> */}
      <div className="flex justify-end">
        <i
          className="ri-close-line text-2xl text-black opacity-50 hover:opacity-100 cursor-pointer"
          onClick={() => props.onRequestClose()}
        />
      </div>
      <div className="flex justify-center mb-6">
        <UpsiteLogoLoader
          heightPx={65}
          widthPx={65}
          animation={checkMarkAnimation}
          nativeColor
          loop={false}
        />
      </div>
      <p className="text-center text-base font-normal mb-6">
        Vedligeholdelsesplan udgivet. <br /> Find den under{' '}
        <span
          onClick={() => {
            history.push(`${ThorPaths.EJENDOMME}/${realEstateId}/rapporter`)
          }}
          className="cursor-pointer underline"
        >
          Rapporter
        </span>
        .
      </p>
      {/* VP Section */}
      <MaintenancePlanButton
        actionIconClassName={plan?.maintenancePlanPDF
          ? 'ri-download-line text-2xl text-black'
          : 'ri-eye text-2xl text-black'
        }
        isLoading={isLoading}
        onClick={() => {
          if (!plan?.maintenancePlanPDF) {
            window.open(window.location.origin + ThorPaths.MAINTENANCE_PLAN_VIEW + '/' + plan?._id, '_blank')
            return;
          }

          downloadFile()
        }}


      />
      {/* </div> */}
    </Modal>
  );
};

export default PublishMaintenancePlanDoneModal;
