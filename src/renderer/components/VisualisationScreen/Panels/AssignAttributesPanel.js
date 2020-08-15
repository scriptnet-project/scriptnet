import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const AssignAttributesPanel = ({ open }) => (
  <Panel
    isOpen={open}
    headerText="Assign node attributes"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AssignAttributesPanel;
