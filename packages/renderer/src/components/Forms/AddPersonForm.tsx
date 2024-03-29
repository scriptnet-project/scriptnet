import { MouseEventHandler } from 'react';
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
// @ts-ignore:next-line
import { useCytoscapeActions } from 'Hooks/Cytoscape';
import { Form, Formik } from 'formik';
// @ts-ignore:next-line
import { baseJurisdictionOptions, baseRoleOptions } from './sharedOptions';
import LocationSelector from '../Fields/LocationSelector';
import ActivePeriodSelector from '../Fields/ActivePeriodSelector';
// @ts-ignore:next-line
import TextField from '../Fields/TextField';
// @ts-ignore:next-line
import Dropdown from '../Fields/Dropdown';
import Field from '../Fields/Field';
import FieldArray from '../Fields/FieldArray';

const theme = getTheme();

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
  jurisdiction: 'Local',
  role: null,
  gender: 'Male',
  involvements: [],
  notes: '',
}

type AddPersonFormProps = {
  initialValues: {
    id: string,
  },
  isEditing: boolean,
  closeDialog: Function,
};

export const AddPersonForm = ({
  initialValues,
  isEditing,
  closeDialog,
}: AddPersonFormProps) => {
  const cyActions = useCytoscapeActions();

  const handleFormSubmit = async (formData: { id: string}) => {
    if (isEditing) {
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

    closeDialog();
  }

  const addPersonSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Please enter a name'),
    role: Yup.string()
      .required('Please choose a role').nullable(),
    involvements: Yup.array()
      .of(Yup.object().shape({
        start: Yup.string().required('Start date is required'),
        end: Yup.string().required('End date is required'),
      }))
  });

  return (
    <Formik
        // @ts-ignore:next-line
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
            className={formStyles.body}
          >
            <Field
              // @ts-ignore:next-line
              name="name"
              label="Name"
              placeholder="Enter the person's name"
              component={TextField}
              required
            />
            <Field
              // @ts-ignore:next-line
              name="role"
              label="Role"
              placeholder="Select a role"
              component={Dropdown}
              options={baseRoleOptions}
              required
            />
            <Field
              // @ts-ignore:next-line
              name="location"
              label="Location"
              placeholder="Select a location"
              component={LocationSelector}
            />
            <Field
              // @ts-ignore:next-line
              name="jurisdiction"
              label="Jurisdiction"
              placeholder="Select a jurisdiction"
              component={Dropdown}
              options={baseJurisdictionOptions}
            />
            <Field
              // @ts-ignore:next-line
              name="gender"
              label="Gender"
              component={Dropdown}
              options={genderOptions}
            />
            <FieldArray
              // @ts-ignore:next-line
              name="involvements"
              label="Period(s) of involvement"
              component={ActivePeriodSelector}
              required
            />
            <Field
              // @ts-ignore:next-line
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
                <DefaultButton
                  text="Cancel"
                  // @ts-ignore:next-line
                  onClick={closeDialog}
                />
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
                <DefaultButton
                  text="Cancel"
                  // @ts-ignore:next-line
                  onClick={closeDialog}
                />
                <PrimaryButton type="submit" text="Add to Case" />
              </>
            )}
          </div>
        </Form>
      </Formik>
  )
}

type FormDialogProps = {
  show: boolean,
  isEditing: boolean,
  initialValues: any,
  onClose: () => void,
  Form: React.FC,
  entityLabel: string,
};

export const FormDialog = ({
  show,
  isEditing,
  initialValues = {},
  onClose,
  Form,
  entityLabel,
}: FormDialogProps) => {
  return (
    <Modal
      isOpen={show}
      isBlocking={true}
      containerClassName={formStyles.container}
      styles={{
        scrollableContent: {
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            maxHeight: '90vh',
        }
      }}
    >
      <div
        className={formStyles.header}
        style={{
          flex: '0 0 auto',
        }}
      >
        <span>
          {isEditing ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
        </span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={onClose}
        />
      </div>
      <Form
        // @ts-ignore:next-line
        initialValues={initialValues}
        isEditing={isEditing}
        closeDialog={onClose}
      />
    </Modal>
  );
}


const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const formStyles = mergeStyleSets({
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

// @ts-ignore:next-line
const AddPersonDialog = (props) => (
  <FormDialog
    {...props}
    Form={AddPersonForm}
    entityLabel="Person"
  />
);

export default AddPersonDialog;
