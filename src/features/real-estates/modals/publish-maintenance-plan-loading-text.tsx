import React, { useEffect, useMemo, useState } from 'react';

// Modules
import classNames from 'classnames';
import ReactModal from 'react-modal';
import UpsiteLogoLoader from '@thor-frontend/common/upsite-logo-loader/upsite-logo-loader';
import toast from '@thor-frontend/common/utils/toast';

let interval = undefined;

const PublishMaintenancePlanLoadingText: React.FC = (props) => {
  // State
  const [running, setRunning] = React.useState(false);
  const [publishProgress, setPublishProgress] = React.useState(0);
  // Effects

  React.useEffect(() => {
    setRunning(true);
  }, []);

  React.useEffect(() => {
    if (running) {
      interval = setInterval(() => {
        setPublishProgress((prev) => prev + 11);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  }, [running]);

  React.useEffect(() => {
    if (publishProgress === 100) {
      setRunning(false);
      clearInterval(interval);
    }
  }, [publishProgress]);

  // Function

  // Return
  return (
    <p className="text-center text-base font-normal mb-6">
      Udgiver vedigeholdelsesplan {publishProgress}% færdig… <br />
      Nu ville være et godt tidspunkt til en frisk kop kaffe
    </p>
  );
};

export default PublishMaintenancePlanLoadingText;
