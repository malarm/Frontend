// 3rd party libraries
import React from 'react';



type Props = {
  title: string;
};

const MaintenancePlanHeader = (props: Props) => {
  return <p className="text-2xl mt-8 mb-2">{props.title}</p>;
};

export default MaintenancePlanHeader;
