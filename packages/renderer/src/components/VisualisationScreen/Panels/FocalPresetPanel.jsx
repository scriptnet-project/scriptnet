import React from 'react';
import { Stack, Text } from '@fluentui/react';
import SidePanel from './SidePanel';

const FocalPresetPanel = ({ isOpen, onDismiss }) => {


  return (
    <SidePanel
      isOpen={isOpen}
      handleDismiss={onDismiss}
      title="Focal Individual Mode"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in focal individual mode. Click on any node to see the ego network surrounding them.</Text>
      </Stack>
    </SidePanel>
  );
}

export default FocalPresetPanel;
