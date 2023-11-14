// 3rd party libraries
import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';

// Workspace libraries
import { TemplateJSON } from '@project/shared/feature-templates/types/template.type'
import { TemplateKind } from '@project/shared/feature-templates/enums/template-kind.enum'
import { UpdateTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/update-template.dto';
import { RichTextEditor } from '@project/ui/rich-text-editor';
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { useUpdateTemplate } from '@thor-frontend/features/templates/queries/update-template';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';



export type IEditCustomTemplateModalProps = {
  isOpen: boolean;
  template: TemplateJSON;
  onRequestClose: () => void;
  confirmHandler: () => void;
}

/**
 * Component description
 */
export const EditCustomTemplateModal: React.FC<IEditCustomTemplateModalProps> = (props) => {

  ReactModal.setAppElement('#root');

  // State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const editCustomTemplateQuery = useUpdateTemplate();

  useEffect(() => {
    if (props.template) {
      setTitle(props.template.title)
      setContent(props.template.content)

      console.log(props.template)
    }
  }, [props.template])

  useEffect(() => {
    setDisableButton(
      props.template?.title === title &&
      props.template?.content === content
    )
  }, [title, content]);


  const submit = async () => {
    try {
      const dto: UpdateTemplateDTOJSON = {
        content: content,
        title: title,
      };

      await editCustomTemplateQuery.mutateAsync({ templateId: props.template._id, dto: dto });

      toast.success('Skabelon oprettet!');
      closeHandler();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };


  const closeHandler = () => {
    props.onRequestClose();
  };

  const loading = false;
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader title="Rediger skabelon" onRequestClose={closeHandler} />

      {/* // Input */}
      <div className="grid gap-x-4 ">
        <div>
          <InputWithLabel
            label={'Title'}
            inputProps={{
              value: title,
              onInput: (e) => setTitle(e.currentTarget.value),
            }}
          />
        </div>
        <div className="mt-3">
          <RichTextEditor
            onChange={(x) => setContent(x)}
            value={content}
          />
        </div>
      </div>
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
    </Modal>
  );
}