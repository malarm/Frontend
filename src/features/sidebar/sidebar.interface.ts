export interface IMenuItem {
  url: string;
  // icon?: IIcon;
  icon?: string;
  name: string;
  customMenuPoint?: ICustomMenuPoint;
  defaultTab?: string;
  subRoutes?: IMenuItem[];
  isDisabled?: boolean;
  disabledTooltip?: string;
}

export type ICustomMenuPoint = () => React.ReactElement;
export type IIcon = React.FC<React.SVGProps<SVGSVGElement>>;
