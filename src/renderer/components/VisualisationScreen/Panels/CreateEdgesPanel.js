import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup, Stack, Text } from '@fluentui/react';
import useCytoscape from 'Hooks/useCytoscape';
import { Panel } from './';

const AddEdgePanel = ({ isOpen, onDismiss }) => {
  const [cy, id,, cyActions] = useCytoscape();
  const options = useSelector(s => s.mode.options);

  const onChange = useCallback((event, option) => {
    console.log('changed edge type:', option.key);
    modeActions.setOption('createEdgeType', option.key);
  }, [id]);

  useEffect(() => {
    if (!isOpen) { return; }
    cyActions.disableEdgeCreation();
    cyActions.enableEdgeCreation(options.createEdgeType);
  }, [isOpen, options.createEdgeType]);

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
          selectedKey={options.createEdgeType}
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
