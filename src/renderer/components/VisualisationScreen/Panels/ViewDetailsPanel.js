import React, { useEffect } from 'react';
import { ChoiceGroup, CompoundButton, DefaultButton, DetailsList, DetailsListLayoutMode, SelectionMode, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

const ViewDetailsPanel = ({
  selectedNode,
  setSelectedNode
}) => {
  const [cy, cyActions] = useCytoscape();

  const details = cy.getElementById(selectedNode).data();

  useEffect(() => {
    return () => {
      cy.getElementById(selectedNode).unselect();
    }
  }, [selectedNode])


  if (!selectedNode || !details) { return false; }

  console.log('view details render', details);

  const {
    name,
    ...attributes
  } = details;

  const formattedAttributes = Object.keys(attributes).map((value, index) => {
    return {
      key: index,
      name: value,
      value: attributes[value]
    }
  });

  console.log('form', formattedAttributes);

  return (
    <Panel
      isOpen={selectedNode}
      onDismiss={() => setSelectedNode(null)}
      headerText="Actor Details"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant={'large'}>Name: {name}</Text>
      </Stack>
      <Stack tokens={{ childrenGap: 10 }}>
        <DetailsList
          items={formattedAttributes}
          columns={[
            { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 0, maxWidth: 30, },
            { key: 'column2', name: 'Value', fieldName: 'value' },
          ]}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      </Stack>
      <Stack>
        <DefaultButton text="Edit" />
        <DefaultButton text="Delete" />
      </Stack>
    </Panel>
  );
}

export default ViewDetailsPanel;
