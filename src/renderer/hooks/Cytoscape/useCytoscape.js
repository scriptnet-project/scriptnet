import { useContext } from 'react';
import CytoscapeContext from './CytoscapeContext';

const useCytoscape = () => {
  const [cy, id] = useContext(CytoscapeContext);

  return { cy, id };
};

export default useCytoscape;
