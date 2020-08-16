import React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';

const AssignAttributesPanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Assign node attributes"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AssignAttributesPanel;
