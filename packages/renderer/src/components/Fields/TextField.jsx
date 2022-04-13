import React from "react";
import { useField } from "formik";
import { TextField as FluentTextField } from "@fluentui/react";

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props.field.name);
  return <FluentTextField label={label} {...field} {...meta} {...props} />;
};

export default TextField;
