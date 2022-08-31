import { get } from "lodash";

const exportState = {};

// Transform collection of involvements into string for CSV encoding
const involvementsToString = (involvements) => involvements.reduce((acc, involvement, index) => {
  const formattedStartDate = new Date(involvement.start).toDateString();
  const formattedEndDate = new Date(involvement.end).toDateString();
  return `${acc}\r\n${formattedStartDate} - ${formattedEndDate}`;
}, '');

const useExportCSV = (cy, state) => {
  const getCSVData = () => {
    const nodes = cy.current.nodes().map((node) => {
      const nodeData = Object.assign({}, node.data());
      nodeData.location = get(nodeData, 'location.label', '');
      nodeData.involvements = involvementsToString(get(nodeData, 'involvements', []));

      return {
        ...nodeData,
        ...node.position(),
      }
    });

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

