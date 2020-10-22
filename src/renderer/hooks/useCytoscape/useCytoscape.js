import { useContext } from 'react';
import CyContext from './CyContext';

const useCytoscape = () =>
  useContext(CyContext);

export default useCytoscape;
