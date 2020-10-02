import React from 'react';
import { AnimatePresence} from 'framer-motion';
import { get } from 'lodash';
import { modes } from './config';
import * as Panels from './Panels';
import { useSessionStorage } from '../../hooks/useSessionStorage';

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

  const [selectedNode, setSelectedNode] = useSessionStorage('selectedNode', null);

  return (
    <AnimatePresence>
      <Panels.CreateEdgesPanel key="one" onDismiss={handleDismiss} isOpen={isPanelOpen('createEdges')(mode)} />
      <Panels.AssignAttributesPanel key="two" onDismiss={handleDismiss} isOpen={isPanelOpen('assignAttributes')(mode)} />
      <Panels.ViewDetailsPanel key="three" selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
      <Panels.ConfigurePanel key="four" onDismiss={handleDismiss} isOpen={isPanelOpen('configure')(mode)} />
    </AnimatePresence>
  );
};

export default PanelManager;
