// 3rd party libraries
import React from 'react';

// Application
import { EnergyA2010,  EnergyA2015,  EnergyA2020,  EnergyB,  EnergyC,  EnergyD,  EnergyE,  EnergyF,  EnergyG,  EnergyNotFound} from '../../../assets/svg';



export const getEnergyLabelIcon = (label: string) => {

  switch (label) {
    case 'A':
      return EnergyA2020;
    case 'B':
      return EnergyB;
    case 'C':
      return EnergyC;
    case 'D':
      return EnergyD;
    case 'E':
      return EnergyE;
    case 'F':
      return EnergyF;
    case 'G':
      return EnergyG;
    default:
      return EnergyNotFound;
  }
};