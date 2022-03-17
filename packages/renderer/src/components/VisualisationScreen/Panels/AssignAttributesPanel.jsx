import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import { useCytoscape } from 'Hooks/Cytoscape';
import { actionCreators as modeActions } from 'Store/mode';
import { Panel } from './';

const AssignAttributesPanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const options = useSelector(s => s.mode.options);
  const dispatch = useDispatch();

  const onChange = useCallback((event, option) => {
    console.log('changed highlight scene:', option.key);
    dispatch(modeActions.setOption('highlightScene', option.key));
  }, [id]);

  return (
    <Panel
      name="assign-attributes-panel"
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Assign Scenes"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>Select a scene from the list below, and then tap actors to add them to it.</Text>
        <ChoiceGroup
            label="Select a scene"
            onChange={onChange}
            selectedKey={options.highlightScene}
            options={[
              { key: 'preparation', text: 'Preparation'},
              { key: 'pre-activity', text: 'Pre-Activity'},
              { key: 'activity', text: 'Activity'},
              { key: 'post-activity', text: 'Post-Activity'},
            ]}
          />
      </Stack>
    </Panel>
  );
}

export default AssignAttributesPanel;
