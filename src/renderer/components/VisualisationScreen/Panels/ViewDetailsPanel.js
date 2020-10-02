import React, { useEffect } from 'react';
import { ChoiceGroup, CompoundButton, DefaultButton, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

const ViewDetailsPanel = ({
  selectedNode,
  setSelectedNode
}) => {
  const [cy, cyActions] = useCytoscape();

  let details;
  let data;

  useEffect(() => {
    if (selectedNode) {
      details = cy.getElementById(selectedNode);
      data = details.data();
      console.log('view details render', data);
    }

    return () => {
      if (details) {
        details.unselect();
      }
    }
  }, [selectedNode])

  if (!selectedNode) { return false; }

  // const {
  //   name,
  //   ...attributes
  // } = details.data();

  return (
    <Panel
      isOpen={selectedNode}
      onDismiss={() => setSelectedNode(null)}
      headerText="Actor Details"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>{selectedNode}</Text>
      </Stack>
      <Stack tokens={{ childrenGap: 10 }}>
        {/* <Text>{name}</Text> */}

      </Stack>
      <Stack>
        <DefaultButton text="Edit" />
        <DefaultButton text="Delete" />
      </Stack>
    </Panel>
  );
}

export default ViewDetailsPanel;
