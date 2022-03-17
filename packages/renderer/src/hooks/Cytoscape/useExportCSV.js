// import electron from 'electron';
// import path from 'path';
// import fse from 'fs-extra';
// import Papa from 'papaparse';

const exportState = {};

const csvOptions = {
  filters: [{
    name: 'CSV File',
    extensions: ['csv']
  }]
};

const useExportCSV = (cy, state) => {
  const exportCSV = () => {
    debugger;

    // const defaultPath = state.filePath ? path.dirname(state.filePath) : null;
    // const options = defaultPath ? { defaultPath, ...csvOptions } : { ...csvOptions };
    // dialog.showSaveDialog(browserWindow, options)
    //   .then(({ canceled, filePath }) => {
    //     if (canceled) { return; }
    //     return path.parse(filePath);
    //   })
    //   .then((filePath) => {
    //     const nodes = cy.current.nodes().map((node) => ({
    //       ...node.data(),
    //       ...node.position(),
    //     }));

    //     const edges = cy.current.edges().map((edge) => ({
    //       ...edge.data(),
    //     }));

    //     const nodesFilePath = path.join(filePath.dir, `${filePath.name}_nodes.csv`);
    //     const edgesFilePath = path.join(filePath.dir, `${filePath.name}_edges.csv`);

    //     fse.writeFile(nodesFilePath, Papa.unparse(nodes), 'utf8');
    //     fse.writeFile(edgesFilePath, Papa.unparse(edges), 'utf8');
    //   });
  };

  const exportActions = { exportCSV };

  return [exportState, exportActions];
};

export default useExportCSV;

