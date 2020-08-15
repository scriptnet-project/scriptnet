import React from 'react';
import { get } from 'lodash';
import { modes } from './config';
import * as Panels from './Panels';

const panelModes = {
  [modes.DEFAULT]: [],
  [modes.ADD_NODE]: ['addNode'],
  [modes.ADD_EDGE]: ['addEdge'],
  [modes.ASSIGN_ATTRIBUTES]: ['assignAttributes'],
  [modes.VIEW_DETAILS]: ['viewDetails'],
  [modes.CONFIGURE]: ['configure'],
};

const getPanels = (mode) =>
  get(panelModes, mode, []);

const showPanel = (panel) => (mode) => getPanels(mode).includes(panel);

const PanelManager = ({ mode }) => {
  return (
    <React.Fragment>
      <Panels.AddNodePanel open={showPanel('addNode')(mode)} />
      <Panels.AddEdgePanel open={showPanel('addEdge')(mode)} />
      <Panels.AssignAttributesPanel open={showPanel('assignAttribuse')(mode)} />
      <Panels.ViewDetailsPanel open={showPanel('viewDetails')(mode)} />
      <Panels.ConfigurePanel open={showPanel('configure')(mode)} />
    </React.Fragment>
  );
};

export default PanelManager;
