import { useContext } from 'react';
import CyContext from './CyContext';

const useCytoscape = () => {
  const cy = useContext(CyContext);

  return cy;
};

export default useCytoscape;
