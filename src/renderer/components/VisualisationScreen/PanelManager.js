import React from 'react';
import { get } from 'lodash';
import { modes } from './config';
import * as Panels from './Panels';

const panelModes = {
  [modes.DEFAULT]: [],
  [modes.CREATE_EDGES]: ['createEdges'],
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
      <Panels.CreateEdgesPanel onDismiss={handleDismiss} isOpen={isPanelOpen('createEdges')(mode)} />
      <Panels.AssignAttributesPanel onDismiss={handleDismiss} isOpen={isPanelOpen('assignAttributes')(mode)} />
      <Panels.ViewDetailsPanel onDismiss={handleDismiss} isOpen={isPanelOpen('viewDetails')(mode)} />
      <Panels.ConfigurePanel onDismiss={handleDismiss} isOpen={isPanelOpen('configure')(mode)} />
    </React.Fragment>
  );
};

export default PanelManager;
