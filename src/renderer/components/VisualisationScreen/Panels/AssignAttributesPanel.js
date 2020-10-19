import React, { useState, useCallback, useEffect } from 'react';
import { ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';

const AssignAttributesPanel = ({ isOpen, onDismiss }) => {
  const [cy, cyActions] = useCytoscape();
  const [highlightScene, setHighlightScene] = useState('preparation');

  const onChange = useCallback((event, option) => {
    console.log('changed highlight scene:', option.key);
    setHighlightScene(option.key);
    cyActions.disableNodeHighlighting();
    cyActions.enableNodeHighlighting(option.key);
  }, []);

  useEffect(() => {
    if (isOpen) {
      cyActions.enableNodeHighlighting(highlightScene);

    }
    return () => {
      cyActions.disableNodeHighlighting();
    }
  }, [isOpen])

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
            selectedKey={highlightScene}
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
