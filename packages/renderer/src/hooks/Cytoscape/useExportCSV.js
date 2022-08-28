// import electron from 'electron';
// import path from 'path';
// import fse from 'fs-extra';
// import Papa from 'papaparse';

const exportState = {};

const useExportCSV = (cy, state) => {
  const getCSVData = () => {
    const defaultPath = state.filePath ? path.dirname(state.filePath) : null;

    const nodes = cy.current.nodes().map((node) => ({
      ...node.data(),
      ...node.position(),
    }));

    const edges = cy.current.edges().map((edge) => ({
      ...edge.data(),
    }));

    return {
      nodes,
      edges,
      filePath: state.filePath,
      csv: defaultPath
    }
  };

  const exportActions = { getCSVData };

  return [exportState, exportActions];
};

export default useExportCSV;

