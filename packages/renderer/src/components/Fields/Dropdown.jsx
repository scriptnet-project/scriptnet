import React from "react";
import { useField } from "formik";
import { Dropdown as FluentDropdown } from "@fluentui/react";

const Dropdown = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.field.name);
  return (
    <FluentDropdown
      {...meta}
      {...field}
      {...props}
      defaultSelectedKey={field.value}
      onChange={(_, d) => helpers.setValue(d.text)}
      options={props.options}
      label={label}
      errorMessage={meta.touched && meta.error}
    />
  );
};

export default Dropdown;
