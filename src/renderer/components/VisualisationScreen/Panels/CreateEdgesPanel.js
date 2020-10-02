import React, { useEffect } from 'react';
import { ChoiceGroup, CompoundButton, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';

const AddEdgePanel = ({ isOpen, onDismiss }) => {
  const [cy, cyActions] = useCytoscape();

  useEffect(() => {
    if (isOpen) {
      cyActions.enableEdgeCreation();
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
          defaultSelectedKey="social"
          options={[
            { key: 'social', text: 'Social Relationship', iconProps: { iconName: 'CalendarDay' } },
            { key: 'financial', text: 'Financial Relationship', iconProps: { iconName: 'CalendarWeek' } },
            { key: 'gang', text: 'Gang or Organization', iconProps: { iconName: 'Calendar' } },
          ]}
        />
      </Stack>
    </Panel>
  );
}

export default AddEdgePanel;
