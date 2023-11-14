// 3rd party libraries
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

// Workspace libraries
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type'
import { UpdateTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/update-template.dto'
import { WorkTaskType } from '@project/shared/feature-work-tasks/enums/work-task-type.enum';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import { Select } from '@thor-frontend/common/select/select';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { WorkTaskTypeIcon } from '@thor-frontend/features/work-tasks/components';
import { useUpdateTemplate } from '@thor-frontend/features/templates/queries/update-template';



export type IEditWorkTaskTemplateModalProps = {
  isOpen: boolean;
  template: TemplateJSON;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

/**
 * Component description
 */
export const EditWorkTaskTemplateModal: React.FC<IEditWorkTaskTemplateModalProps> = (props) => {

  //State
  const [type, setType] = useState<WorkTaskType>();
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>();
  const [disableButton, setDisableButton] = useState(true);

  const editCustomTemplateQuery = useUpdateTemplate();

  useEffect(() => {
    if (props.template.workTaskContent) {
      setType(props.template.workTaskContent.workTaskType)
      setAmount(props.template.workTaskContent.amount)
      setDescription(props.template.workTaskContent.description)
      setUnit(props.template.workTaskContent.unit)
      setUnitPrice(props.template.workTaskContent.unitPrice)

      console.log(props.template)
    }
  }, [props.template.workTaskContent])

  useEffect(() => {
    setDisableButton(
      props.template.workTaskContent.description === description &&
      props.template.workTaskContent.workTaskType === type &&
      props.template.workTaskContent.amount === amount &&
      props.template.workTaskContent.unit === unit &&
      props.template.workTaskContent.unitPrice === unitPrice
    );
  }, [
    amount,
    description,
    unit,
    unitPrice,
    type,
    props.template.workTaskContent,
  ]);

  const closeHandler = () => {
    props.onRequestClose();
  };

  const submit = async () => {
    try {
      const dto: UpdateTemplateDTOJSON = {

        workTaskContent: {
          description,
          workTaskType: type,
          amount,
          unit,
          unitPrice
        }
      };

      await editCustomTemplateQuery.mutateAsync({ templateId: props.template._id, dto: dto });

      toast.success('Skabelon oprettet!');
      closeHandler();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const loading = false;

  return (
    <Modal
      isOpen={props.isOpen}
      setIsOpen={closeHandler}
      topClassName="top-[75px]"
    >
      {/* header */}
      <ModalHeader title="Rediger skabelon" onRequestClose={closeHandler} />

      <div
        className={classNames(' transition-all',)}

      >
        {/* // Type */}
        <div className="flex flex-col gap-2 mb-5">
          <p className="text-sm mt-4 text-neutral-500 font-medium">Type</p>
          <Select
            activeClassName="bg-black/5"
            openTextColorClass="text-black"
            items={[
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="maintenance"
                    />
                    <p className="text-base font-medium">Vedligehold</p>
                  </div>
                ),
                value: 'maintenance',
              },
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="operating"
                    />
                    <p className="text-base font-medium">Drift</p>
                  </div>
                ),
                value: 'operating',
              },
              {
                display: (
                  <div className="flex">
                    <WorkTaskTypeIcon
                      className="h-5 w-5 mr-2 mt-0.5"
                      workTaskType="improvement"
                    />
                    <p className="text-base font-medium">Forbedring</p>
                  </div>
                ),
                value: 'improvement',
              },
            ]}
            value={type}
            onChange={(x: WorkTaskType) => {
              console.log(x);
              setType(x);
            }}
          />
        </div>

        {/* udførselsår, beskrivelse */}
        <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">

          <InputWithLabel
            className="gap-2 col-span-3"
            label={
              <p className="text-sm text-neutral-500">Kort beskrivelse*</p>
            }
            inputProps={{
              value: description,
              onInput: (e) => setDescription(e.currentTarget.value),
              onChange: (e) =>
                setDescription((e.target as HTMLInputElement).value),
            }}
          />
        </div>

        {/* amount, unit, unitprice, totalprice */}
        <div className="grid columns-4 auto-cols-fr gap-x-4 gap-y-2 grid-flow-col mb-5">
          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Antal*</p>}
            inputProps={{
              value: amount,
              onInput: (e) => setAmount(Number(e.currentTarget.value)),
              onChange: (e) =>
                setAmount(Number((e.target as HTMLInputElement).value)),
            }}
          />

          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Enhed*</p>}
            inputProps={{
              value: unit,
              onInput: (e) => setUnit(e.currentTarget.value),
            }}
          />

          <InputWithLabel
            className="gap-2"
            label={<p className="text-sm text-neutral-500">Enhedspris*</p>}
            inputProps={{
              value: unitPrice,
              onInput: (e) => setUnitPrice(Number(e.currentTarget.value)),
              onChange: (e) =>
                setUnitPrice(Number((e.target as HTMLInputElement).value)),
            }}
          />
        </div>
      </div>
      {/* buttons */}
      <div className="grid grid-flow-col justify-end gap-2">
        <ModalTwoButtons
          cancelBtnText="Annuller"
          onRequestClose={closeHandler}
          cancelColor="secondary"
          cancelTextColor="text-neutral-700 "
          btnText="Gem ændringer"
          loading={loading}
          disabled={disableButton}
          confirmHandler={submit}
        />
      </div>
    </Modal>
  );
};

