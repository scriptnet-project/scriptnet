import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ComboBox,
  DatePicker
} from '@fluentui/react';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Field, Form, Formik, useField } from 'formik';
import { FormikTextField, FormikChoiceGroup, FormikDropdown, FormikDatePicker } from 'formik-office-ui-fabric-react'
import { baseJurisdictionOptions, baseLocationOptions, baseRoleOptions } from './sharedOptions';
import LocationSelector from '../Fields/LocationSelector';
import ActivePeriodSelector from '../Fields/ActivePeriodSelector';

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
  notes: '',
  firstInvolvement: '',
  lastInvolvement: '',
}

const CustomFormikDatePicker = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);
  console.log({field, meta, helpers});
  const { value } = meta;
  const { setValue } = helpers;

  const normalizedValue = useMemo(() => {
    if (value && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }, [value]);

  return (
    <>
      <DatePicker
        label={label}
        value={normalizedValue}
        onSelectDate={(date) => {
          console.log('yooo', date);
          setValue(date.toISOString());
        }}
        placeholder="Select a date..."
        ariaLabel="Select a date"
      />
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </>
  )
}

export const AddPersonForm = ({
  initialValues,
  isUpdate,
  formRef,
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
    <Formik
        initialValues={{ ...defaultValues, ...initialValues }}
        onSubmit={handleFormSubmit}
        validate={validate}
        validateOnBlur={false}
        innerRef={formRef}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
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
                name="sex"
                label="Sex"
                component={FormikDropdown}
                options={sexOptions}
              />
              <Field
                name="involvements"
                label="Period(s) of involvement"
                component={ActivePeriodSelector}
              />
              <Field
                name="notes"
                label="Notes"
                component={FormikTextField}
                multiline
                rows={10}
              />
            </Form>
            )
        } }
      </Formik>
  )
}

const AddPersonDialog = ({
  show,
  isUpdate,
  initialValues = {},
}) => {

  return (
    <Dialog
      hidden={!show}
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
      <AddPersonForm initialValues={initialValues} isUpdate={isUpdate} />
      { !isUpdate && (
        <DialogFooter>
          <DefaultButton text="Cancel" />
          <PrimaryButton type="submit" text="Add to Network" />
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default AddPersonDialog;


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


