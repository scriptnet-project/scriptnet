import { useContext } from 'react';
import CytoscapeContext from './CytoscapeContext';

const useCytoscapeActions = () => {
  const [,,, cyActions] = useContext(CytoscapeContext);

  // some kind of memoisation?

  return cyActions;
};

export default useCytoscapeActions;
