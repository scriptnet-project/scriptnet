import Cytoscape from 'cytoscape';

const CytoscapeContext = React.createContext(new Cytoscape());

const CytoscapeProvider = CytoscapeContext.Provider;

const useCytoscape = () => {
  const cy = useContext(CytoscapeContext);

  return cy;
};

export { CytoscapeProvider };

export default useCytoscape;
