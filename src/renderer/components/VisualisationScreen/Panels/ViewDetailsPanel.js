import React, { Fragment, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultButton, PrimaryButton, Panel, PanelType } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import { useCytoscape } from 'Hooks/Cytoscape';
import { AddPersonForm } from '../../Forms/AddPersonForm';

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const { cy, id } = useCytoscape();
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();
  const form = useRef(null);
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

  const submitHandler = () => {
    if (form.current) {
      form.current.handleSubmit()
    }
  }

  return (
    <Fragment>
      <Panel
        name="view-details-panel"
        isOpen={isOpen}
        isLightDismiss
        type={PanelType.customNear}
        customWidth={350}
        isBlocking={false}
        onDismiss={handleDismiss}
        headerText="Details"
        onRenderFooterContent={() => (
          <>
            <DefaultButton text="Delete" onClick={handleRemove} style={{ color: props.theme.primaryColor }}/>
            <DefaultButton text="Cancel" onClick={handleRemove}/>
            <PrimaryButton type="submit" text="Update" onClick={submitHandler} />
          </>
        )}
        // Stretch panel content to fill the available height so the footer is positioned
        // at the bottom of the page
        isFooterAtBottom={true}
      >
        <AddPersonForm
          initialValues={details}
          isUpdate
          onClose={() => setForm(null)}
          formRef={form}
        />
      </Panel>
    </Fragment>
  );
}

export default ViewDetailsPanel;
