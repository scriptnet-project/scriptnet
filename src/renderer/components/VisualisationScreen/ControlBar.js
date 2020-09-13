import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { modes } from 'Components/VisualisationScreen/config';
import useCytoscape from 'Hooks/useCytoscape';
import './ControlBar.scss';

const ControlBar = ({
  onSetMode,
}) => {
  const [, cyActions] = useCytoscape();

  return (
    <div className="ControlBar">
      <Stack horizontal>
        <DefaultButton text="Open Network" onClick={() => cyActions.openNetwork()}/>
        <DefaultButton text="Save Network" onClick={() => cyActions.saveNetwork()}/>
        <DefaultButton text="Nodes" onClick={() => onSetMode(modes.ADD_NODE)}/>
        <DefaultButton text="Edges" onClick={() => onSetMode(modes.ADD_EDGE)}/>
        <DefaultButton text="Actions" onClick={() => onSetMode(modes.ASSIGN_ATTRIBUTES)}/>
        <DefaultButton text="Configure" onClick={() => onSetMode(modes.CONFIGURE)}/>
      </Stack>
    </div>
  );
};

export default ControlBar;

