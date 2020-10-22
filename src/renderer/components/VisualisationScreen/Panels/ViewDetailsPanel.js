import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultButton, DetailsList, DetailsListLayoutMode, SelectionMode, Stack, Text } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import useCytoscape from 'Hooks/useCytoscape';
import { Panel } from '.';

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const [cy] = useCytoscape();
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();

  if (!cy.current) { return null; }

  const details = cy.current.getElementById(selectedElement).data();

  const handleRemove = useCallback(() => {
    if (!selectedElement) { return; }
    cy.current.getElementById(selectedElement).remove();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement]);

  const handleDismiss = useCallback(() => {
    cy.current.getElementById(selectedElement).unselect();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement]);

  if (!isOpen || !details) return false;

  console.log('details', details);

  const formattedAttributes = Object.keys(details).map((value, index) => {
    return {
      key: index,
      name: value,
      value: details[value]
    }
  });

  return (
    <Panel
      name="view-details-panel"
      isOpen={isOpen}
      onDismiss={handleDismiss}
      headerText="Actor Details"
    >
      {/* <Stack tokens={{ childrenGap: 10 }}>
        <Text variant={'large'}>Name: {name}</Text>
      </Stack> */}
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
        <DefaultButton text="Delete" onClick={handleRemove}/>
      </Stack>
    </Panel>
  );
}

export default ViewDetailsPanel;
