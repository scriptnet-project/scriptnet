import { Label, ILabelStyles, getTheme } from '@fluentui/react';
import { Field as FormikField } from 'formik';

type FieldProps = {
  label: string;
  field: {
    name: string;
    label: string;
  };
  form: {
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, value: any) => void;
  };
};

const Field = ({label, ...props}: FieldProps) => {
  const theme = getTheme()
  const labelStyles: Partial<ILabelStyles> = {
    root: {
      marginTop: theme.spacing.m,
    },
  };

  return (
   <>
    <Label
      styles={labelStyles}
    >{label}</Label>
    <FormikField {...props} />
   </>
  );
}

export default Field;
