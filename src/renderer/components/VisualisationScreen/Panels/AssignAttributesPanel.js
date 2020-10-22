import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import useCytoscape from 'Hooks/useCytoscape';
import { actionCreators as modeActions } from 'Store/mode';
import { Panel } from './';

const AssignAttributesPanel = ({ isOpen, onDismiss }) => {
  const [cy, id,, cyActions] = useCytoscape();
  const options = useSelector(s => s.mode.options);

  const onChange = useCallback((event, option) => {
    console.log('changed highlight scene:', option.key);
    modeActions.setOption('highlightScene', option.key);
  }, [id]);

  useEffect(() => {
    if (!isOpen) { return; }
    cyActions.disableNodeHighlighting();
    cyActions.enableNodeHighlighting(options.highlightScene);
  }, [isOpen, options.highlightScene]);

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
      <Stack>
          <DefaultButton text="Manage Actions" />
        </Stack>
    </Panel>
  );
}

export default AssignAttributesPanel;
