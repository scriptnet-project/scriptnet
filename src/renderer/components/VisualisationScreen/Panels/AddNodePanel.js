import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const AddNodePanel = ({ open }) => (
  <Panel
    isOpen={open}
    headerText="Add node"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AddNodePanel;
