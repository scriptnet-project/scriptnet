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

const getOpenPanelsForMode = mode =>
  get(panelModes, mode, []);

const isPanelOpen = panel =>
  mode =>
    getOpenPanelsForMode(mode).includes(panel);

const PanelManager = ({ mode, onSetMode }) => {
  const handleDismiss = () =>
    onSetMode(modes.DEFAULT);

  return (
    <React.Fragment>
      <Panels.AddNodePanel onDismiss={handleDismiss} isOpen={isPanelOpen('addNode')(mode)} />
      <Panels.AddEdgePanel onDismiss={handleDismiss} isOpen={isPanelOpen('addEdge')(mode)} />
      <Panels.AssignAttributesPanel onDismiss={handleDismiss} isOpen={isPanelOpen('assignAttribuse')(mode)} />
      <Panels.ViewDetailsPanel onDismiss={handleDismiss} isOpen={isPanelOpen('viewDetails')(mode)} />
      <Panels.ConfigurePanel onDismiss={handleDismiss} isOpen={isPanelOpen('configure')(mode)} />
    </React.Fragment>
  );
};

export default PanelManager;
