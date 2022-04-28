import { Label, ILabelStyles, getTheme } from '@fluentui/react';
import { FieldArray as FormikFieldArray } from 'formik';


// Wrapper component that adds a label to a formik fieldArray so we can style it
const FieldArray = ({label, ...props}) => {
  const theme = getTheme()
  const labelStyles: Partial<ILabelStyles> = {
    root: {
      marginTop: theme.spacing.s1,
    },
  };

  return (
   <>
    <Label
      styles={labelStyles}
    >{label}</Label>
    <FormikFieldArray {...props} />
   </>
  );
}

export default FieldArray;
