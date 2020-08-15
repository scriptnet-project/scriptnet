import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const ViewDetailsPanel = ({ open }) => (
  <Panel
    isOpen={open}
    headerText="Actor Details"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default ViewDetailsPanel;
