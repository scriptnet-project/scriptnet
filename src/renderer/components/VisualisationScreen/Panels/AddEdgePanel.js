import React from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

const AddEdgePanel = ({ isOpen, onDismiss }) => (
  <Panel
    isOpen={isOpen}
    onDismiss={onDismiss}
    headerText="Add edge"
    closeButtonAriaLabel="Close"
  >
    content here
  </Panel>
);

export default AddEdgePanel;
