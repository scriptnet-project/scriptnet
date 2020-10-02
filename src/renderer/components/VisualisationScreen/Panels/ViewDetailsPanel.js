import React, { useEffect } from 'react';
import { ChoiceGroup, CompoundButton, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

const ViewDetailsPanel = ({
  selectedNode,
  setSelectedNode
}) => {
  const [cy, cyActions] = useCytoscape();

  console.log('view details render');

  return (
    <Panel
      isOpen={selectedNode}
      onDismiss={() => setSelectedNode(null)}
      headerText="Actor Details"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>{selectedNode}</Text>
      </Stack>
    </Panel>
  );
}

export default ViewDetailsPanel;
