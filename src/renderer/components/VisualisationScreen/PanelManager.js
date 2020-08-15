import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { modes } from './config';
import * as Panels from './Panels';

const panelModes = {
  [modes.DEFAULT]: [],
  [modes.ADD_NODE]: [<Panels.AddNodePanel key="AddNodePanel" />],
  [modes.ADD_EDGE]: [<Panels.AddEdgePanel key="AddEdgePanel"  />],
  [modes.ASSIGN_ATTRIBUTES]: [<Panels.AssignAttributesPanel key="AssignAttributesPanel" />],
  [modes.VIEW_DETAILS]: [<Panels.ViewDetailsPanel key="ViewDetailsPanel" />],
  [modes.CONFIGURE]: [
    <Panels.ConfigurePanel key="ConfigurePanel" />,
    <Panels.PlaceholderPanel key="PlaceholderPanel" />
  ],
};

const getPanels = (mode) =>
  panelModes[mode];

const PanelManager = ({ mode, onSetMode }) => {
  return (
    <AnimatePresence>
      {getPanels(mode)}
      <Panels.ControlPanel onSetMode={onSetMode}/>
    </AnimatePresence>
  );
};

export default PanelManager;
