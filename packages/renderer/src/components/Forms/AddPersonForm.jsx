import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from '@fluentui/react';
import * as Yup from 'yup';
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Form, Formik } from 'formik';
import { baseJurisdictionOptions, baseRoleOptions } from './sharedOptions';
import LocationSelector from '../Fields/LocationSelector';
import ActivePeriodSelector from '../Fields/ActivePeriodSelector';
import TextField from '../Fields/TextField';
import Dropdown from '../Fields/Dropdown';
import Field from '../Fields/Field';
import FieldArray from '../Fields/FieldArray';
import AutoSave from './AutoSave';

const genderOptions = [
  {key: 'Male', text: 'Male' },
  {key: 'Female', text: 'Female' },
  {key: 'Transgender Female', text: 'Transgender Female'},
  {key: 'Transgender Male', text: 'Transgender Male'},
  {key: 'Gender Nonconforming', text: 'Gender Nonconforming'},
  {key: 'Unknown', text: 'Unknown' },
  {key: 'Other', text: 'Other' },
];

const defaultValues = {
  name: '',
  location: null,
  jurisdiction: 'local',
  role: 'null',
  gender: 'Male',
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

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    role: Yup.string()
      .required('Required role'),
    involvements: Yup.array()
      .of(Yup.object().shape({
        start: Yup.string().required('Start date is required'),
        end: Yup.string().required('End date is required'),
      }))
      .min('1', 'At least one involvement is required')
      .required('Required'),
  });

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
        validationSchema={SignupSchema}
        validateOnBlur={true}
        innerRef={formRef}
      >
        {() => {
          return (
            <Form>
              { isUpdate && (
                <AutoSave debounceMs={500} />
              )}
              <Field
                name="name"
                label="Name"
                placeholder="Enter the person's name"
                component={TextField}
                required
              />
              <Field
                name="role"
                label="Role"
                placeholder="Select a role"
                component={Dropdown}
                options={baseRoleOptions}
                required
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
                name="gender"
                label="Gender"
                component={Dropdown}
                options={genderOptions}
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
