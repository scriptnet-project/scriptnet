import React, { useEffect, useState, useCallback } from 'react';
import { ChoiceGroup, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';

const AddEdgePanel = ({ isOpen, onDismiss }) => {
  const [, cyActions] = useCytoscape();
  const [createEdgeType, setCreateEdgeType] = useState('social');

  const onChange = useCallback((event, option) => {
    console.log('changed edge type:', option.key);
    setCreateEdgeType(option.key);
    cyActions.disableEdgeCreation();
    cyActions.enableEdgeCreation(option.key);
  }, []);

  useEffect(() => {
    if (isOpen) {
      cyActions.enableEdgeCreation(createEdgeType);
    }
    return () => {
      cyActions.disableEdgeCreation();
    }
  }, [isOpen])

  return (
    <Panel

      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Add Relationship"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>Select a relationship type below, and create links between actors by dragging a line between them.</Text>
        <ChoiceGroup
          label="Select relationship type to create"
          onChange={onChange}
          selectedKey={createEdgeType}
          options={[
            { key: 'social', text: 'Social Relationship'},
            { key: 'financial', text: 'Financial Relationship'},
            { key: 'gang', text: 'Gang or Organisation'},
          ]}
        />
      </Stack>
    </Panel>
  );
}

export default AddEdgePanel;
