import React from 'react';
import './loader.css';

const TotalBalls = 8;

/**
 * #### Fixed size loader component
 *
 * The styling of the loader is generated using the nearby gen-css.js file
 *
 */
export const Loader: React.FC = () => {
  return (
    <div className="thor-wrapper">
      <div className="thor-loader">
        {new Array(TotalBalls).fill(0).map((_, i) => (
          <div
            key={`thor-ball-${i}-${Math.random()}`}
            className={`thor-ball`}
          />
        ))}
      </div>
    </div>
  );
};
