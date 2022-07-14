import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
} from '@fluentui/react';
import * as Yup from 'yup';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Form, Formik } from 'formik';
import { baseJurisdictionOptions } from './sharedOptions';
import { formStyles, FormDialog } from './AddPersonForm';
import LocationSelector from '../Fields/LocationSelector';
import ActivePeriodSelector from '../Fields/ActivePeriodSelector';
import TextField from '../Fields/TextField';
import Dropdown from '../Fields/Dropdown';
import Field from '../Fields/Field';
import FieldArray from '../Fields/FieldArray';

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
  location: null,
  jurisdiction: 'local',
  function: null,
  involvements: [],
  notes: '',
};

const AddResourceForm = ({
  closeDialog,
  isEditing,
  initialValues = {},
}) => {
  const cyActions = useCytoscapeActions();

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData);

    if (isEditing) {
      const { id, ...data } = formData;
      cyActions.update(id, data);
    } else {
      cyActions.add({
        group: 'nodes',
        data: {
          type: 'resource',
          ...formData
        },
      });
    }

    closeDialog();
  }

  const addResourceSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Enter a name for this resource'),
    function: Yup.string()
      .required('Please select which function this resource performed').nullable(),
    involvements: Yup.array()
      .of(Yup.object().shape({
        start: Yup.string().required('Start date is required'),
        end: Yup.string().required('End date is required'),
      }))
  });

  return (
    <Formik
      initialValues={{ ...defaultValues, ...initialValues }}
      onSubmit={handleFormSubmit}
      validationSchema={addResourceSchema}
      validateOnBlur={false}
    >
      <Form
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
      >
        <div className={formStyles.body}>
          <Field
            name="name"
            label="Type [e.g. van, website, distillery, product/goods]"
            placeholder="Enter the resource type"
            component={TextField}
          />
          <Field
            name="location"
            label="Location"
            placeholder="Select a location"
            component={LocationSelector}
          />
          <Field
            name="jurisdiction"
            label="Jurisdiction"
            placeholder="Select a jurisdiction"
            component={Dropdown}
            options={baseJurisdictionOptions}
          />
          <Field
            name="function"
            label="Function"
            placeholder="Select a function"
            component={Dropdown}
            options={functionOptions}
          />
          <FieldArray
            name="involvements"
            label="Period(s) of involvement"
            component={ActivePeriodSelector}
            required
          />
          <Field
            name="notes"
            label="Notes"
            multiline
            rows={10}
            component={TextField}
          />
        </div>
        <div
          className={formStyles.footer}
          style={{
            flex: '0 0 auto',
          }}
        >
          { isEditing ? (
            <>
              <DefaultButton text="Cancel" onClick={closeDialog} />
              <PrimaryButton
                iconProps={{ iconName: 'delete', children: theme.palette.red}}
                style={{backgroundColor: theme.palette.red, color:'white'}}
                onClick={() => {
                  cyActions.remove(initialValues.id);
                  closeDialog();
                }}
                >
                  Delete
              </PrimaryButton>
              <PrimaryButton type="submit" text="Save and Close" />
            </>
          ) : (
            <>
              <DefaultButton text="Cancel" onClick={closeDialog} />
              <PrimaryButton type="submit" text="Add to Case" />
            </>
          )}
        </div>
      </Form>
    </Formik>
  );
}

const AddResourceDialog = (props) => (
  <FormDialog
    {...props}
    Form={AddResourceForm}
    entityLabel="Resource"
  />
);

export default AddResourceDialog;
