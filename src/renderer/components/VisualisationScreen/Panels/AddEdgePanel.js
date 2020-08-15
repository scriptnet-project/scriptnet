import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const AddEdgePanel = ({ open }) => (
  <Panel
    isOpen={open}
    headerText="Add edge"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AddEdgePanel;
