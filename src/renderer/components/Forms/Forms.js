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
  location: AddLocationForm,
  resource: AddResourceForm,
  organisation: AddOrganisationForm,
};

const Forms = ({
  form,
  onClose,
  isNew,
  isUpdate,
}) => {
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();

  const initialValues = {};

  return Object.keys(forms)
    .map((formName) => {
      const Form = forms[formName];
      const show = formName === form;

      const props = {
        key: formName,
        initialValues,
        show,
        isUpdate,
        isNew,
        onClose,
      };

      return <Form {...props} />
    });
};

Forms.defaultProps = {
  form: null,
  onClose: noop,
  isNew: true,
  isUpdate: false,
};

export default Forms;

