import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import electron from 'electron';
import path from 'path';
import { pick, omit } from 'lodash';
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
        return filePath;
      })
      .then((filePath) => {
        const nodes = cy.current.nodes().map((node) => ({
          ...node.data(),
          ...node.position(),
        }));
        fse.writeFile(filePath, Papa.unparse(nodes), 'utf8');
      });
  };

  const exportActions = { exportCSV };

  return [exportState, exportActions];
};

export default useExportCSV;

