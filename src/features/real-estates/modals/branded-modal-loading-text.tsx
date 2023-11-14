// 3rd party libraries
import React from 'react';



// Modules

export type Props = {
  text: string;
  secondLineText?: string;
  intervalMiliSeconds: number;
  publishProgressAddBy: number;
  stall: boolean
};

let interval = undefined;

const BrandedUpsiteLoadingText: React.FC<Props> = (props: Props) => {
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
        setPublishProgress((prev) => Math.min(prev + props.publishProgressAddBy, props.stall ? 99 : 100));
      }, props.intervalMiliSeconds);
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
      {props.text} {publishProgress}% færdig… <br />
      {props.secondLineText}
    </p>
  );
};

BrandedUpsiteLoadingText.defaultProps = {
  secondLineText: 'Nu ville være et godt tidspunkt til en frisk kop kaffe',
  stall: false
};

export default BrandedUpsiteLoadingText;
