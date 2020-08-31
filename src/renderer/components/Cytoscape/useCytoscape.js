import { CyContext } from './CyProvider';

const useCytoscape = () => {
  const cy = useContext(CyContext);

  return cy;
};

export default useCytoscape;
