import React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';

const AddNodePanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Add node"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AddNodePanel;
