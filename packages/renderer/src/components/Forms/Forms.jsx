import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddPersonForm from './AddPersonForm';
import AddOrganisationForm from './AddOrganisationForm';
import AddResourceForm from './AddResourceForm';
import { getActiveForm } from '../../store/selectors/form';
import { actionCreators as formActions, forms } from '../../store/form';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import { getSelectedId } from '../../store/selectors/visualisation';
import useCytoscape from '../../hooks/Cytoscape';
import { get } from 'lodash';
import AddLocationForm from './AddLocationForm';

export const formsByType = {
  PERSON: AddPersonForm,
  RESOURCE: AddResourceForm,
  ORGANISATION: AddOrganisationForm,
  LOCATION: AddLocationForm
};

const Forms = () => {
  const { cy } = useCytoscape();
  const [initialValues, setInitialValues] = useState({});
  const activeForm = useSelector(getActiveForm)
  const selectedNode = useSelector(getSelectedId);
  const dispatch = useDispatch();

  const handleFormClose = useCallback(() => {
    if (selectedNode) {
      cy.current.nodes().unselect();
      dispatch(visualisationActions.clearSelected())
    }

    dispatch(formActions.resetForm());
    setInitialValues({});
  }, [dispatch, selectedNode, cy]);

  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    // When a node is selected, get its data and set it as the initial values for the form
    // then set the appropriate form as active.
    const selectedNodeData = cy.current.elements(`#${selectedNode}`).data();
    const typeToUpperCase = get(selectedNodeData, 'type', '').toUpperCase();
    const formForType = get(forms, `${typeToUpperCase}`, null);

    if (!formForType) {
      console.warn(`No form for type ${typeToUpperCase}`);
      return;
    }

    console.log(typeToUpperCase, formForType);
    setInitialValues(selectedNodeData);
    dispatch(formActions.setForm(forms[typeToUpperCase]));
  }, [selectedNode])

  return Object.keys(formsByType)
    .map((formName) => {
      const Form = formsByType[formName];
      const show = formName === activeForm;

      return <Form
        key={formName}
        show={show}
        isEditing={!!selectedNode}
        onClose={handleFormClose}
        initialValues={initialValues}
      />
    });
};

export default Forms;

