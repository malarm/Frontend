// 3rd party libraries
import { FC, ReactNode } from 'react';
import { SetOptional } from 'type-fest'

// Workspace libraries
import { FileButton, IFileButtonProps } from '@thor-frontend/common/files/file-button';



const MaintenancePlanButton: FC<SetOptional<IFileButtonProps, 'children'>> = (props) => {
  return (
    <FileButton {...props}>{props.children}</FileButton>
  );
};

MaintenancePlanButton.defaultProps = {
  children: 'Vedligeholdelsesplan.pdf'
}

export default MaintenancePlanButton;
