import React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';

const ConfigurePanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Configure app"
    closeButtonAriaLabel="Close"
    isBlocking={false}
  >
    content here
  </Panel>
);

export default ConfigurePanel;
