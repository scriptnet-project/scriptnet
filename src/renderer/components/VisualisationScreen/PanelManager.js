import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as modeActions, modes } from '../../store/mode';
import { AnimatePresence} from 'framer-motion';
import * as Panels from './Panels';

const PanelManager = () => {
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();
  const setMode = (mode) => dispatch(modeActions.setMode(mode));
  const setSelectedNode = (node) => dispatch(selectedNodeActions.setSelectedNode(node));

  const handleDismiss = () =>
    setMode(modes.DEFAULT);

  console.log('pan man', mode);

  return (
    <React.Fragment>
      <Panels.CreateEdgesPanel onDismiss={handleDismiss} isOpen={ mode === modes.CREATE_EDGES } />
      <Panels.AssignAttributesPanel onDismiss={handleDismiss} isOpen={ mode === modes.ASSIGN_ATTRIBUTES } />
      <Panels.ViewDetailsPanel isOpen={selectedNode}/>
      {/* <Panels.ConfigurePanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE } /> */}
    </React.Fragment>
  );
};

export default PanelManager;
