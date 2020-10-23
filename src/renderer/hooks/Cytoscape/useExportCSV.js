import electron from 'electron';
import path from 'path';
import fse from 'fs-extra';
import Papa from 'papaparse';

const dialog = electron.remote.dialog;
const browserWindow = electron.remote.getCurrentWindow();

const exportState = {};

const csvOptions = {
  filters: [{
    name: 'CSV File',
    extensions: ['csv']
  }]
};

const useExportCSV = (cy, state) => {
  const exportCSV = () => {
    const defaultPath = state.filePath ? path.basename(state.filePath, 'csv') : null;
    const options = defaultPath ? { defaultPath, ...csvOptions } : { ...csvOptions };

    dialog.showSaveDialog(browserWindow, options)
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return; }
        return path.parse(filePath);
      })
      .then((filePath) => {
        const nodes = cy.current.nodes().map((node) => ({
          ...node.data(),
          ...node.position(),
        }));

        const edges = cy.current.edges().map((edge) => ({
          ...edge.data(),
        }));

        const nodesFilePath = path.join(filePath.dir, `${filePath.name}_nodes${filePath.ext}`);
        const edgesFilePath = path.join(filePath.dir, `${filePath.name}_edges${filePath.ext}`);

        fse.writeFile(nodesFilePath, Papa.unparse(nodes), 'utf8');
        fse.writeFile(edgesFilePath, Papa.unparse(edges), 'utf8');
      });
  };

  const exportActions = { exportCSV };

  return [exportState, exportActions];
};

export default useExportCSV;

