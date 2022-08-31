import { Label, ILabelStyles, getTheme } from '@fluentui/react';
import { FieldArray as FormikFieldArray, FieldArrayConfig } from 'formik';

// Wrapper component that adds a label to a formik fieldArray so we can style it
const FieldArray = ({label, ...props}: { label: string }) => {
  const theme = getTheme()
  const labelStyles: Partial<ILabelStyles> = {
    root: {
      marginTop: theme.spacing.s1,
    },
  };

  const fieldArrayProps = props as FieldArrayConfig;

  return (
   <>
    <Label
      styles={labelStyles}
    >{label}</Label>
    <FormikFieldArray {...fieldArrayProps} />
   </>
  );
}

export default FieldArray;
