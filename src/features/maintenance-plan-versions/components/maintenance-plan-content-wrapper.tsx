// 3rd party libraries
import { FC, ReactNode } from 'react';



type Props = {
  children: ReactNode;
  className?: string
};

const MaintenancePlanContentWrapper: FC<Props> = (props) => {
  // added mb-[90px] to avoid AI bot overlap
  return <div className={`mx-8 bg-white mb-[90px] ${props.className}`}>{props.children}</div>;
};

MaintenancePlanContentWrapper.defaultProps = {
  className: ''
}

export default MaintenancePlanContentWrapper;
