import { useRef, useCallback } from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Modal,
  IconButton,
  IButtonStyles,
  IStackProps,
  IIconProps,
  FontWeights,
  getTheme,
  mergeStyleSets,
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
  isEditing,
  closeDialog,
}) => {

  console.log('Add persomn form', isEditing);

  const cyActions = useCytoscapeActions();

  const handleFormSubmit = async (formData) => {
    console.log('add person submit called', isEditing, formData);
    if (isEditing) {
      const { id, ...data } = formData;
      console.log(data);
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

    closeDialog();
  }

  const addPersonSchema = Yup.object().shape({
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

  return (
    <Formik
        initialValues={{ ...defaultValues, ...initialValues }}
        onSubmit={handleFormSubmit}
        validationSchema={addPersonSchema}
        validateOnBlur={true}
      >
        <Form
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
          }}
        >
          <div
            className={contentStyles.body}
          >
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
          </div>
          <div
            className={contentStyles.footer}
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
                <PrimaryButton type="submit" text="Add to Network" />
              </>
            )}
          </div>
        </Form>
      </Formik>
  )
}

const AddPersonDialog = ({
  show,
  isEditing,
  initialValues = {},
  onClose,
}) => {
  return (
    <Modal
      isOpen={show}
      containerClassName={contentStyles.container}
      styles={{
        scrollableContent: {
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            maxHeight: '90vh',
            zIndex: 99999999,
        }
      }}
    >
      <div
        className={contentStyles.header}
        style={{
          flex: '0 0 auto',
        }}
      >
        <span>
          {isEditing ? 'Edit Person' : 'Add Person'}
        </span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={onClose}
        />
      </div>
      <AddPersonForm
        initialValues={initialValues}
        isEditing={isEditing}
        closeDialog={onClose}
      />
    </Modal>
  );
}


const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    width: 600,
  },
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    padding: '0 24px 24px 24px',
    overflowY: 'scroll',
  },
  footer: {
    flex: '0 0 auto',
    padding: '12px 12px 14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
});
const stackProps: Partial<IStackProps> = {
  horizontal: true,
  tokens: { childrenGap: 40 },
  styles: { root: { marginBottom: 20 } },
};
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

export default AddPersonDialog;
