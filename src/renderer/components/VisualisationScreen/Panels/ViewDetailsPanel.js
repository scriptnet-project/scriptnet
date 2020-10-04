import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as selectedNodeActions} from '../../../store/selectedNode';
import { DefaultButton, DetailsList, DetailsListLayoutMode, SelectionMode, Stack, Text } from '@fluentui/react';
import { Panel } from '.';
import useCytoscape from '../../../hooks/useCytoscape';

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const [cy] = useCytoscape();
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();
  const setSelectedNode = (node) => dispatch(selectedNodeActions.setSelectedNode(node));


  const details = cy.getElementById(selectedNode).data();

  if (!isOpen || !details) return false;

  const {
    name,
    ...attributes
  } = details;

  const formattedAttributes = Object.keys(attributes).map((value, index) => {
    return {
      key: index,
      name: value,
      value: attributes[value]
    }
  });

  const handleDismiss = () => {
    cy.getElementById(selectedNode).unselect();
    setSelectedNode(null);
  }

  return (
    <Panel
      name="view-details-panel"
      isOpen={isOpen}
      onDismiss={handleDismiss}
      headerText="Actor Details"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant={'large'}>Name: {name}</Text>
      </Stack>
      <Stack tokens={{ childrenGap: 10 }}>
        <DetailsList
          items={formattedAttributes}
          columns={[
            { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 0, maxWidth: 30, },
            { key: 'column2', name: 'Value', fieldName: 'value' },
          ]}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      </Stack>
      <Stack>
        <DefaultButton text="Edit" />
        <DefaultButton text="Delete" />
      </Stack>
    </Panel>
  );
}

export default ViewDetailsPanel;
