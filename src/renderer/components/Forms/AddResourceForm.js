import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from '@fluentui/react';
import { useCytoscape, useCytoscapeActions } from 'Hooks/Cytoscape';
import { Field, Form, Formik } from 'formik';
import { FormikTextField, FormikDropdown } from 'formik-office-ui-fabric-react'
import { baseJurisdictionOptions, baseLocationOptions } from './sharedOptions';

const locationOptions = [
  {key: 'N/A', text: 'N/A'},
  ...baseLocationOptions,
];

const functionOptions = [
  {key: 'Production', text: 'Production' },
  {key: 'Distribution', text: 'Distribution' },
  {key: 'Aquisition', text: 'Aquisition' },
  {key: 'Exchange', text: 'Exchange' },
  {key: 'Facilitation', text: 'Facilitation' },
  {key: 'Finances', text: 'Finances' },
];

const defaultValues = {
  name: '',
  location: 'N/A',
  jurisdiction: 'local',
  organisationType: 'Private',
  function: '',
  role: '',
};

const AddResourceForm = ({
  show,
  onClose,
  initialValues = {},
}) => {
  const cyActions = useCytoscapeActions();

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData);
    cyActions.add({
      group: 'nodes',
      data: {
        type: 'resource',
        ...formData
      },
    });

    onClose();
    return true;
  }

  const validate = (values) => {
    console.log('validate', values);
    const errors = {};

    if (!values.name) {
      errors.name = 'Please enter a name';
    }

    if (!values.function) {
      errors.function = 'Please select a function';
    }

    return errors
  }

  return (
    <Dialog
      hidden={!show}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add a Resource',
      }}
      modalProps={{
        isBlocking: true, // Makes background click close dialog
      }}
      maxWidth="500px" // Default is too narrow - could use grid size?
      minWidth="500px"
    >
      <Formik
        initialValues={{ ...defaultValues, ...initialValues }}
        onSubmit={handleFormSubmit}
        validate={validate}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
        <Form>
          <Field
            name="name"
            label="Type [e.g. van, website, distillery, product/goods]"
            placeholder="Enter the resource type"
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
            placeholder="Select a function"
            component={FormikDropdown}
            options={functionOptions}
          />
          <DialogFooter>
            <DefaultButton onClick={onClose} text="Cancel" />
            <PrimaryButton type="submit" text="Add to Network" />
          </DialogFooter>
        </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddResourceForm;
