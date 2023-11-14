
/**
 * Returns the color hex code of an energy label
 * classification eg 'A'
 * 
 * @param label (eg 'A' or 'B')
 * @returns 
 */
export const getEnergyLabelColor = (label: string): string => {
  switch (label.toUpperCase()) {
    case 'A':
      return '#00865C';
    case 'B':
      return '#6DE08C';
    case 'C':
      return '#FFD95C';
    case 'D':
      return '#FEBA4B';
    case 'E':
      return '#FF8159';
    case 'F':
      return '#FF5374';
    case 'G':
      return '#81394A';
    default:
      return '#000000';
  }
};