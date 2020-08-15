import React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';

const ViewDetailsPanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Actor Details"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default ViewDetailsPanel;
