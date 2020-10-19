import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedId } from 'Store/selectors/visualisation';
import { actionCreators as modeActions, modes } from 'Store/mode';
import * as Panels from './Panels';

const PanelManager = () => {
  const mode = useSelector(state => state.mode);
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();
  const setMode = (mode) => dispatch(modeActions.setMode(mode));

  const handleDismiss = () =>
    setMode(modes.DEFAULT);

  console.log('pan man', mode);

  return (
    <React.Fragment>
      <Panels.CreateEdgesPanel onDismiss={handleDismiss} isOpen={ mode === modes.CREATE_EDGES } />
      <Panels.AssignAttributesPanel onDismiss={handleDismiss} isOpen={ mode === modes.ASSIGN_ATTRIBUTES } />
      <Panels.ViewDetailsPanel isOpen={selectedElement}/>
      {/* <Panels.ConfigurePanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE } /> */}
    </React.Fragment>
  );
};

export default PanelManager;
