import React, { Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultButton, DetailsList, DetailsListLayoutMode, SelectionMode, Stack, Text } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import { useCytoscape } from 'Hooks/Cytoscape';
import Forms from 'Components/Forms/Forms';
import { Panel } from './';

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const { cy, id } = useCytoscape();
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();
  const [form, setForm] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  const handleRemove = useCallback(() => {
    if (!selectedElement) { return; }
    cy.current.getElementById(selectedElement).remove();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  const handleDismiss = useCallback(() => {
    cy.current.getElementById(selectedElement).unselect();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  const handleEdit = useCallback(() => {
    const currentValue = cy.current.elements(`#${selectedElement}`).data();
    console.log({ currentValue });
    setInitialValues(currentValue);
    setForm(currentValue.type);
  }, [selectedElement, id]);

  if (!cy.current) { return null; }

  const isNode = cy.current.getElementById(selectedElement).isNode();
  const details = cy.current.getElementById(selectedElement).data();

  if (!isOpen || !details) { return false; }

  const formattedAttributes = Object.keys(details).map((value, index) => {
    return {
      key: index,
      name: value,
      value: details[value]
    }
  });

  return (
    <Fragment>
      <Forms
        form={form}
        onClose={() => setForm(null)}
        isUpdate
        initialValues={initialValues}
      />
      <Panel
        name="view-details-panel"
        isOpen={isOpen}
        onDismiss={handleDismiss}
        headerText="Details"
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
          { isNode && <DefaultButton text="Edit" onClick={handleEdit} /> }
          <DefaultButton text="Delete" onClick={handleRemove}/>
        </Stack>
      </Panel>
    </Fragment>
  );
}

export default ViewDetailsPanel;
