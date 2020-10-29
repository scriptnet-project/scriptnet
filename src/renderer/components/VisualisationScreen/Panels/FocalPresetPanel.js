import React from 'react';
import { Stack, Text } from '@fluentui/react';
import { Panel } from './';

const FocalPresetPanel = ({ isOpen, onDismiss }) => {


  return (
    <Panel
      name="assign-attributes-panel"
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Focal Individual Mode"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in focal individual mode. Click on any node to see the ego network surrounding them.</Text>
      </Stack>
    </Panel>
  );
}

export default FocalPresetPanel;
