import React from 'react';
import Panel from '../Panel';
import { modes } from '../config';

const ControlBar = ({
  onSetMode,
}) => (
  <Panel type="bottom">
    <div className="clickable" onClick={() => onSetMode(modes.ADD_NODE)}>Add actors</div>
    <div className="clickable" onClick={() => onSetMode(modes.ADD_EDGE)}>Add links</div>
    <div className="clickable" onClick={() => onSetMode(modes.ASSIGN_ATTRIBUTES)}>Assign actions</div>
    <div className="clickable" onClick={() => onSetMode(modes.CONFIGURE)}>Change visualisation</div>
  </Panel>
);

export default ControlBar;

