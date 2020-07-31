import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import Panel from 'Components/VisualisationScreen/Panel';
import { modes } from 'Components/VisualisationScreen/config';

const ControlBar = ({
  onSetMode,
}) => (
  <Panel type="bottom">
    <Stack horizontal>
      <DefaultButton text="Nodes" onClick={() => onSetMode(modes.ADD_NODE)}/>
      <DefaultButton text="Edges" onClick={() => onSetMode(modes.ADD_EDGE)}/>
      <DefaultButton text="Actions" onClick={() => onSetMode(modes.ASSIGN_ATTRIBUTES)}/>
      <DefaultButton text="Configure" onClick={() => onSetMode(modes.CONFIGURE)}/>
    </Stack>
  </Panel>
);

export default ControlBar;

