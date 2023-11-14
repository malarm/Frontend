// Workspace libraries
import { Condition1,  Condition2,  Condition3,  Condition4, } from '@thor-frontend/assets/svg';



// Functions
export const renderConditionIcon: React.FC = (value: number) => {
  switch (value) {
    case 0:
      return <Condition1 />;
    case 1:
      return <Condition2 />;
    case 2:
      return <Condition3 />;
    case 3:
      return <Condition4 />;
    default:
      return <div />;
  }
};
export const getConditionText = (value: number): string => {
  switch (value) {
    case 0:
      return 'Meget god';
    case 1:
      return 'Acceptabel';
    case 2:
      return 'Mindre god';
    case 3:
      return 'Kritisk';
    default:
      return '';
  }
};
