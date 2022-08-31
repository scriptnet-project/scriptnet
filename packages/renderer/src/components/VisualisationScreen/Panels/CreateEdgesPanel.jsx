import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup, Stack, Text } from '@fluentui/react';
import { useCytoscape } from 'Hooks/Cytoscape';
import { actionCreators as modeActions } from 'Store/mode';
import SidePanel from './SidePanel';

const AddEdgePanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const options = useSelector(state => state.mode.options);
  const dispatch = useDispatch();

  const onChange = useCallback((event, option) => {
    console.log('changed edge type:', option.key);
    dispatch(modeActions.setOption('createEdgeType', option.key));
  }, [id]);

  return (
    <SidePanel
      isOpen={isOpen}
      handleDismiss={onDismiss}
      title="Add Relationship"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>Select a relationship type below, and create links between nodes by dragging a line between them.</Text>
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
            { key: 'working', text: 'Working Relationship'},
          ]}
        />
      </Stack>
    </SidePanel>
  );
}

export default AddEdgePanel;
