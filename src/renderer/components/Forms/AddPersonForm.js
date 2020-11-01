import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { FormikTextField, FormikChoiceGroup, FormikDropdown } from 'formik-office-ui-fabric-react'
import { baseJurisdictionOptions, baseLocationOptions, baseRoleOptions } from './sharedOptions';

const sexOptions = [
  {key: 'Male', text: 'Male' },
  {key: 'Female', text: 'Female' },
  {key: 'Unknown', text: 'Unknown' },
];

const defaultValues = {
  name: '',
  location: 'Ireland',
  jurisdiction: 'local',
  role: '',
  sex: 'Male',
}

const AddPersonForm = ({
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
          type: 'person',
          ...formData
        },
      });
    }

    onClose();
    return true;
  }

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Please enter a name'
    }

    if (!values.role) {
      errors.role = 'Please select a role'
    }

    return errors
  }

  return (
    <Dialog
      hidden={!show}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: isUpdate ? 'Update Person' : 'Add a Person',
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
            placeholder="Enter the person's name"
            component={FormikTextField}
          />
          <Field
            name="role"
            label="Role"
            placeholder="Select a role"
            component={FormikDropdown}
            options={baseRoleOptions}
          />
          <Field
            name="location"
            label="Geographical location"
            placeholder="Select a location"
            component={FormikDropdown}
            options={baseLocationOptions}
          />
          <Field
            name="jurisdiction"
            label="Jurisdiction"
            placeholder="Select a jurisdiction"
            component={FormikDropdown}
            options={baseJurisdictionOptions}
          />
          <Field
            name="sex"
            label="Sex"
            component={FormikChoiceGroup}
            options={sexOptions}
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

export default AddPersonForm;


// Attempt at wrapping <ComboBox>.
// Works except for creating new items
const FormikComboBox = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, handleChange, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
})  => {
  return (
    <ComboBox
      {...field}
      {...props}
      onChange={(event, option, index, value) => {
        console.log('change', option, index, value);
        if (option && option.key) {
          setFieldValue(field.name, option.key);
          return;
        }
        locationOptions.push({
          key: value,
          text: value,
        });

        setFieldValue(field.name, value);
      }}
    />
  );
};


