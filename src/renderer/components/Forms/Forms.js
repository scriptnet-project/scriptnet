import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import AddPersonForm from 'Components/Forms/AddPersonForm';
import AddLocationForm from 'Components/Forms/AddLocationForm';
import AddOrganisationForm from 'Components/Forms/AddOrganisationForm';
import AddResourceForm from 'Components/Forms/AddResourceForm';

const forms = {
  person: AddPersonForm,
  // location: AddLocationForm,
  // resource: AddResourceForm,
  // organisation: AddOrganisationForm,
};

const Forms = ({
  form,
  onClose,
  isNew,
  isUpdate,
  onSubmit,
}) => {
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();

  const initialValues = {};

  return Object.keys(forms)
    .map((formName) => {
      const show = formName === form;
      const Form = forms[formName];

      const props = {
        key: formName,
        initialValues,
        onSubmit,
        show,
        onClose,
      };

      return <Form {...props} />
    });
};

Forms.defaultProps = {
  form: null,
  onClose: noop,
  onSubmit: noop,
  isNew: true,
  isUpdate: false,
};

export default Forms;

