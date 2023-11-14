// 3rd party libraries
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';

// Workspace libraries
import { InputWithLabel } from '@thor-frontend/common/input-with-label';
import ModalTwoButtons from '@thor-frontend/common/modal/modal-two-buttons';
import { RichTextEditor } from '@project/ui/rich-text-editor';
import { useCreateTemplate } from '@thor-frontend/features/templates/queries/create-template';
import toast from '@thor-frontend/common/utils/toast';
import { getErrorMessage } from '@project/ui/get-error-message';
import { CreateCustomTemplateDTOJSON } from '@project/shared/feature-templates/types/dtos/create-custom-template.dto'
import { TemplateKind } from '@project/shared/feature-templates/enums/template-kind.enum';
import { useCurrentUser } from '@thor-frontend/features/users/queries/current-user';
import { Modal } from '@thor-frontend/common/modal/modal';
import ModalHeader from '@thor-frontend/common/modal/modal-header';



export interface Props extends ReactModal.Props {
  isOpen: boolean;
  kind: TemplateKind;
  standardCardId: string;
  content: string;
  onRequestClose: () => void;
  confirmHandler: () => void;
  onSavedTemplate: (content: string) => void;
}

const CreateCustomTemplateModal: React.FC<Props> = (props) => {
  ReactModal.setAppElement('#root');

  // State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  //Hook
  const createCustomTemplateQuery = useCreateTemplate();
  const currentUser = useCurrentUser().data;

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const isValid = title.length > 0;

  const reset = () => {
    setTitle('');
    setContent('');
  };

  const submit = async () => {
    try {
      const dto: CreateCustomTemplateDTOJSON = {
        content: content,
        title: title,
        standardCardId: props.standardCardId,
        creatingUser: {
          name: currentUser.name,
          userId: currentUser._id,
          username: currentUser.username,
        },
        kind: props.kind,
        organizationId: currentUser?.organizations[0]?.organizationId,
      };

      await createCustomTemplateQuery.mutateAsync({ dto: dto });

      toast.success('Skabelon oprettet!');
      props.onSavedTemplate(content);
      closeHandler();
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const closeHandler = () => {
    props.onRequestClose();
  };

  const loading = false;
  // Return
  return (
    <Modal isOpen={props.isOpen} {...props}>
      <ModalHeader title="Gem som skabelon" onRequestClose={closeHandler} />

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
            placeholder="Tilføj beskrivelse af ejendommen..."
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
        btnText="Gem skabelon"
        loading={loading}
        disabled={!isValid}
        confirmHandler={submit}
      />
    </Modal>
  );
};

export default CreateCustomTemplateModal;
