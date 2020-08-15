import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const ConfigurePanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Configure app"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default ConfigurePanel;
