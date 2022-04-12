import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ComboBox,
} from '@fluentui/react';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Field, Form, Formik } from 'formik';
import { baseJurisdictionOptions, baseLocationOptions } from './sharedOptions';
import LocationSelector from '../Fields/LocationSelector';

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

const defaultValues = {
  name: '',
  location: 'N/A',
  jurisdiction: 'local',
  function: ''
};

const AddLocationForm = ({
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
          type: 'location',
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
      errors.name = 'Please enter a name'
    }

    if (!values.function) {
      errors.function = 'Please select a function'
    }

    return errors
  }

  return (
    <Dialog
      hidden={!show}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: isUpdate ? 'Update Location' : 'Add a Location',
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
            label="Name (or type) of location [e.g. 'Stoke'/'playground'/'online platform']"
            placeholder="Enter a location name or type"
            component={FormikTextField}
          />
          <Field
            name="location"
            label="Geographical location"
            placeholder="Select a location"
            component={LocationSelector}
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
            <PrimaryButton type="submit" text={ isUpdate ? "Update" : "Add to Network"} />
          </DialogFooter>
        </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddLocationForm;
