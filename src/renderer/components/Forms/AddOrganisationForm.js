import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from '@fluentui/react';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Field, Form, Formik } from 'formik';
import { FormikTextField, FormikDropdown, FormikChoiceGroup } from 'formik-office-ui-fabric-react'
import { baseJurisdictionOptions, baseLocationOptions, baseRoleOptions } from './sharedOptions';

const locationOptions = [
  {key: 'N/A', text: 'N/A'},
  ...baseLocationOptions,
];

const functionOptions = [
  {key: 'Production', text: 'Production' },
  {key: 'Distribution', text: 'Distribution' },
  {key: 'TradingAndWholesale', text: 'Trading and Wholesale' },
  {key: 'Transportation', text: 'Transportation' },
  {key: 'Retail', text: 'Retail' },
  {key: 'Disposal', text: 'Disposal' },
];

const typeOptions = [
  {key: 'Private', text: 'Private' },
  {key: 'Public', text: 'Public' },
  {key: 'Other', text: 'Other' },
];

const defaultValues = {
  name: '',
  location: 'N/A',
  jurisdiction: 'local',
  organisationType: 'Private',
  function: '',
  role: '',
};

const AddOrganisationForm = ({
  show,
  onClose,
  isUpdate,
  initialValues = {},
}) => {
  const cyActions = useCytoscapeActions();

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData);

    if (isUpdate) {
      const { id, ...data } = formData;
      cyActions.update(id, data);
    } else {
      cyActions.add({
        group: 'nodes',
        data: {
          type: 'organisation',
          ...formData
        },
      });
    }

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

    if (!values.role) {
      errors.role = 'Please select a role';
    }

    return errors
  }

  return (
    <Dialog
      hidden={!show}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: isUpdate ? 'Update Organisation' : 'Add an Organisation',
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
            label="Name"
            placeholder="Enter the organisation name"
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
            name="organisationType"
            label="Type"
            placeholder="Select a type"
            component={FormikChoiceGroup}
            options={typeOptions}
          />
          <Field
            name="function"
            label="Function"
            placeholder="Select a function"
            component={FormikDropdown}
            options={functionOptions}
          />
          <Field
            name="role"
            label="Role"
            placeholder="Select a role"
            component={FormikDropdown}
            options={baseRoleOptions}
          />
          <DialogFooter>
            <DefaultButton onClick={onClose} text="Cancel" />
            <PrimaryButton type="submit" text={ isUpdate ? "Update" : "Add to Network"} />
          </DialogFooter>
        </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddOrganisationForm;
