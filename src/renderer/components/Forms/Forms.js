import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import AddPersonForm from 'Components/Forms/AddPersonForm';
import AddLocationForm from 'Components/Forms/AddLocationForm';
import AddOrganisationForm from 'Components/Forms/AddOrganisationForm';
import AddResourceForm from 'Components/Forms/AddResourceForm';

export const formsByType = {
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
  initialValues,
}) => {
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();

  return Object.keys(formsByType)
    .map((formName) => {
      const Form = formsByType[formName];
      const show = formName === form;

      return <Form
        key={formName}
        show={show}
        isUpdate={isUpdate}
        isNew={isNew}
        onClose={onClose}
        initialValues={initialValues}
      />
    });
};

Forms.defaultProps = {
  form: null,
  onClose: noop,
  isNew: false,
  isUpdate: false,
  initialValues: {},
};

export default Forms;

