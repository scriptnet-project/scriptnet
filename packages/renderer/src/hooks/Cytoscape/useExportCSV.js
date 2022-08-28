const exportState = {};

const useExportCSV = (cy, state) => {
  const getCSVData = () => {
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
    }
  };

  const exportActions = { getCSVData };

  return [exportState, exportActions];
};

export default useExportCSV;

