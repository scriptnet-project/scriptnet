import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as modeActions, modes } from '../../store/mode';
import * as Panels from './Panels';

const PanelManager = () => {
  const mode = useSelector(state => state.mode.mode);
  const options = useSelector(state => state.mode.options);
  const dispatch = useDispatch();

  const handleDismiss = () =>
    dispatch(modeActions.resetMode());

  return (
    <React.Fragment>
      <Panels.CreateEdgesPanel onDismiss={handleDismiss} isOpen={ mode === modes.CREATE_EDGES } />
      <Panels.AssignAttributesPanel onDismiss={handleDismiss} isOpen={ mode === modes.ASSIGN_ATTRIBUTES } />
      <Panels.FocalPresetPanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE && options.preset === 'focal'} />
      <Panels.JurisdictionPresetPanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE && options.preset === 'jurisdiction'} />
      <Panels.ScenePresetPanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE && options.preset === 'scene'} />
      <Panels.RelationshipsPresetPanel onDismiss={handleDismiss} isOpen={ mode === modes.CONFIGURE && options.preset === 'relationship-filter'} />
    </React.Fragment>
  );
};

export default PanelManager;
