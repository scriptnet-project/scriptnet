import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from '@fluentui/react';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Form, Formik } from 'formik';
import { baseJurisdictionOptions, baseRoleOptions } from './sharedOptions';
import LocationSelector from '../Fields/LocationSelector';
import ActivePeriodSelector from '../Fields/ActivePeriodSelector';
import TextField from '../Fields/TextField';
import Dropdown from '../Fields/Dropdown';
import Field from '../Fields/Field';

const sexOptions = [
  {key: 'Male', text: 'Male' },
  {key: 'Female', text: 'Female' },
  {key: 'Unknown', text: 'Unknown' },
];

const defaultValues = {
  name: '',
  location: null,
  jurisdiction: 'local',
  role: '',
  sex: 'Male',
  involvements: [],
  notes: '',
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
                component={TextField}
              />
              <Field
                name="role"
                label="Role"
                placeholder="Select a role"
                component={Dropdown}
                options={baseRoleOptions}
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
                name="sex"
                label="Sex"
                component={Dropdown}
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
                multiline
                rows={10}
                component={TextField}
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
