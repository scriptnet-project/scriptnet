import React, { Fragment, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultButton, PrimaryButton, Panel, PanelType, getTheme } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import { useCytoscape } from 'Hooks/Cytoscape';
import { AddPersonForm } from '../../Forms/AddPersonForm';

const theme = getTheme();

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const { cy, id } = useCytoscape();
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();
  const form = useRef(null);

  const handleRemove = useCallback(() => {
    if (!selectedElement) { return; }
    cy.current.getElementById(selectedElement).remove();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  const handleDismiss = useCallback(() => {
    cy.current.getElementById(selectedElement).unselect();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  if (!cy.current) { return null; }

  const details = cy.current.getElementById(selectedElement).data();

  if (!isOpen || !details) { return false; }

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
            <DefaultButton text="Delete" onClick={handleRemove} style={{ background: theme.themeTertiary }}/>
            <DefaultButton text="Cancel"/>
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
          formRef={form}
        />
      </Panel>
    </Fragment>
  );
}

export default ViewDetailsPanel;
