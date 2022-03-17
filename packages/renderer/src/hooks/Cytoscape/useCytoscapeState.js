import { useContext } from 'react';
import CytoscapeContext from './CytoscapeContext';

const useCytoscapeState = () => {
  const [,, cyState] = useContext(CytoscapeContext);

  // some kind of memoisation?

  return cyState;
};

export default useCytoscapeState;
