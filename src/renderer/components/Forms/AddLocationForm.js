import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ComboBox,
} from '@fluentui/react';
import useCytoscape from 'Hooks/useCytoscape';
import { Field, Form, Formik } from 'formik';
import { FormikTextField, FormikDropdown } from 'formik-office-ui-fabric-react'
import { baseJurisdictionOptions, baseLocationOptions } from './sharedOptions';

const locationOptions = [
  {key: 'N/A', text: 'N/A'},
  ...baseLocationOptions,
];

const functionOptions = [
  {key: 'Offending location', text: 'Offending location' },
  {key: 'Meeting', text: 'Meeting' },
  {key: 'Storage', text: 'Storage' },
  {key: 'Hideaway', text: 'Hideaway' },
  {key: 'Unknown', text: 'Unknown' },
];

const AddLocationForm = ({
  toggleHideDialog,
  hideDialog,
}) => {
  const [cy, cyActions] = useCytoscape();

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData);
    cy.add({
      group: 'nodes',
      data: {
        type: 'location',
        ...formData
      },
    });

    cyActions.runLayout();
    toggleHideDialog();
    return true;
  }

  const initialValues = {
    name: '',
    location: 'N/A',
    jurisdiction: 'local',
    function: ''
  };

  const validate = (values) => {
    console.log('validate', values);
    const errors = {};

    if (!values.name) {
      errors.name = 'Please enter a name'
    }

    if (!values.function) {
      errors.function = 'Please select a function'
    }

    return errors
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add a Location',
      }}
      modalProps={{
        isBlocking: true, // Makes background click close dialog
      }}
      maxWidth="500px" // Default is too narrow - could use grid size?
      minWidth="500px"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validate={validate}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
        <Form>
          <Field
            name="name"
            label="Name (or type) of location [e.g. 'Stoke'/'playground'/'online platform']"
            placeholder="Enter a location name or type"
            component={FormikTextField}
          />
          <Field
            name="location"
            label="Geographical location"
            placeholder="Select a location"
            component={FormikDropdown}
            options={locationOptions}
          />
          <Field
            name="jurisdiction"
            label="Jurisdiction"
            placeholder="Select a jurisdiction"
            component={FormikDropdown}
            options={baseJurisdictionOptions}
          />
          <Field
            name="function"
            label="Function"
            component={FormikDropdown}
            options={functionOptions}
          />
          <DialogFooter>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
            <PrimaryButton type="submit" text="Add to Network" />
          </DialogFooter>
        </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddLocationForm;
