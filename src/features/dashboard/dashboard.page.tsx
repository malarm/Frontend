// 3rd party libraries
import Lottie from 'react-lottie';
import { flatten } from 'lottie-colorify';
import classNames from 'classnames';

// Workspace libraries
import { TopBar } from '@thor-frontend/features/layouts/top-bar';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';

// Application
import animation from '../../assets/json/upsite_animation_black.json';



const Dashboard = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      className: 'bg-red-200 p-2 rounded shadow-lg cursor-default',
    },
    animationData: flatten('#ffffff', animation),
  };

  return <div
    className={classNames('grow flex flex-col h-screen')}
  >
    <TopBar title={'Dashboard'} />
    <div className="h-full overflow-auto">
      <div className="px-8 pb-8">
        <UpsiteLogoLoader />
        <div className="flex justify-start">
          <div className="w-12 h-12 shadow-xl">
            <Lottie
              isClickToPauseDisabled
              options={defaultOptions}
              style={{
                margin: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default Dashboard;
