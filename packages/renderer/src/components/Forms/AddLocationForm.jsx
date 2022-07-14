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
  {key: 'Offending location', text: 'Offending location' },
  {key: 'Meeting', text: 'Meeting' },
  {key: 'Storage', text: 'Storage' },
  {key: 'Hideaway', text: 'Hideaway' },
  {key: 'Unknown', text: 'Unknown' },
];

const defaultValues = {
  name: '',
  location: null,
  jurisdiction: 'local',
  function: null,
  involvements: [],
  notes: '',
};

const AddLocationForm = ({
  closeDialog,
  isEditing,
  initialValues = {},
}) => {
  const cyActions = useCytoscapeActions();

  const handleFormSubmit = (formData) => {
    if (isEditing) {
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

    closeDialog();
  }

  const addLocationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    function: Yup.string()
      .required('Required function'),
    involvements: Yup.array()
      .of(Yup.object().shape({
        start: Yup.string().required('Start date is required'),
        end: Yup.string().required('End date is required'),
      }))
      .min('1', 'At least one involvement is required')
      .required('Required'),
  });

  return (
    <Formik
      initialValues={{ ...defaultValues, ...initialValues }}
      onSubmit={handleFormSubmit}
      validationSchema={addLocationSchema}
      validateOnBlur={false}
    >
      <Form>
        <div className={formStyles.body}>
          <Field
            name="name"
            label="Name (or type) of location [e.g. 'Stoke'/'playground'/'online platform']"
            placeholder="Enter a location name or type"
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

const AddLocationDialog = (props) => (
  <FormDialog
    {...props}
    Form={AddLocationForm}
    entityLabel="Location"
  />
);


export default AddLocationDialog;
