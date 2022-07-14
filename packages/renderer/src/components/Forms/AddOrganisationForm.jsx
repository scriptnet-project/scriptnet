import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
} from '@fluentui/react';
import * as Yup from 'yup';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Form, Formik } from 'formik';
import { baseJurisdictionOptions, baseRoleOptions } from './sharedOptions';
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
  {key: 'Trading and Wholesale', text: 'Trading and Wholesale' },
  {key: 'Transportation', text: 'Transportation' },
  {key: 'Retail', text: 'Retail' },
  {key: 'Disposal', text: 'Disposal' },
];

const typeOptions = [
  {key: 'Private', text: 'Private' },
  {key: 'Public', text: 'Public' },
  {key: 'Other', text: 'Other' },
];

const sectorOptions = [
  {key: 'Construction', text: 'Construction'},
  {key: 'Real Estate', text: 'Real Estate'},
  {key: 'Power', text: 'Power'},
  {key: 'Oil and Gas / Energy', text: 'Oil and Gas / Energy'},
  {key: 'Financial Services - Banking', text: 'Financial Services - Banking'},
  {key: 'Financial Services - Other', text: 'Financial Services - Other'},
  {key: 'Pharmaceuticals', text: 'Pharmaceuticals'},
  {key: 'Healthcare', text: 'Healthcare'},
  {key: 'Technology', text: 'Technology'},
  {key: 'Manufacturing', text: 'Manufacturing'},
  {key: 'Defense', text: 'Defence'},
  {key: 'Logistics', text: 'Logistics'},
  {key: 'Food and Beverage', text: 'Food and Beverage'},
  {key: 'Other', text: 'Other'},
];

const defaultValues = {
  name: '',
  location: null,
  jurisdiction: 'local',
  function: null,
  organisationType: 'Private',
  sector: null,
  role: null,
  involvements: [],
  notes: '',
};

const AddOrganisationForm = ({
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
          type: 'organisation',
          ...formData
        },
      });
    }

    closeDialog();
  }

  const addOrganisationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Please enter a name for this organisation'),
    function: Yup.string()
      .required('Please select which function this organisation performed').nullable(),
    role: Yup.string()
      .required('Please select a role').nullable(),
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
      validationSchema={addOrganisationSchema}
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
            label="Name"
            placeholder="Enter the organisation name"
            component={TextField}
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
            component={Dropdown}
            options={baseJurisdictionOptions}
          />
          <Field
            name="organisationType"
            label="Type"
            placeholder="Select a type"
            component={Dropdown}
            options={typeOptions}
          />
          <Field
            name="function"
            label="Function"
            placeholder="Select a function"
            component={Dropdown}
            options={functionOptions}
          />
          <Field
            name="role"
            label="Role"
            placeholder="Select a role"
            component={Dropdown}
            options={baseRoleOptions}
          />
          <Field
            name="sector"
            label="Sector"
            placeholder="Select a sector"
            component={Dropdown}
            options={sectorOptions}
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

const AddOrganisationDialog = (props) => (
  <FormDialog
    {...props}
    Form={AddOrganisationForm}
    entityLabel="Organisation"
  />
);

export default AddOrganisationDialog;
