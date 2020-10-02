import { ChoiceGroup, CompoundButton, Stack, Text } from '@fluentui/react';
import React from 'react';
import { Panel } from '.';

const AssignAttributesPanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Assign Attributes"
  >
    <Stack tokens={{ childrenGap: 10 }}>
      <Text>Select a relationship type below, and create links between actors by dragging a line between them.</Text>
    </Stack>
  </Panel>
);

export default AssignAttributesPanel;
