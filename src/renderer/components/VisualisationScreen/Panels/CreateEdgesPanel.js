import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup, Stack, Text } from '@fluentui/react';
import { useCytoscape } from 'Hooks/Cytoscape';
import { actionCreators as modeActions } from 'Store/mode';
import { Panel } from './';

const AddEdgePanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const options = useSelector(s => s.mode.options);
  const dispatch = useDispatch();

  const onChange = useCallback((event, option) => {
    console.log('changed edge type:', option.key);
    dispatch(modeActions.setOption('createEdgeType', option.key));
  }, [id]);

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
            { key: 'personal', text: 'Personal Relationship'},
            { key: 'communication', text: 'Communication Relationship'},
            { key: 'financial', text: 'Financial Relationship'},
            { key: 'business', text: 'Business Relationship'},
            { key: 'ownership', text: 'Ownership Relationship'},
          ]}
        />
      </Stack>
    </Panel>
  );
}

export default AddEdgePanel;
