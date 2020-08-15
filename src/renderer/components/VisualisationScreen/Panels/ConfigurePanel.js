import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const ConfigurePanel = ({ open }) => (
  <Panel
    isOpen={open}
    headerText="Configure app"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default ConfigurePanel;
