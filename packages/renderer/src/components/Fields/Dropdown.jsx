import React from "react";
import { useField } from "formik";
import { Dropdown as FluentDropdown } from "@fluentui/react";

const Dropdown = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.field.name);
  console.log({ props, field, meta, helpers})
  return (
    <FluentDropdown
      {...meta}
      {...field}
      {...props}
      defaultSelectedKey={field.value}
      onChange={(_, d) => helpers.setValue(d)}
      options={props.options}
      label={label}
    />
  );
};

export default Dropdown;
