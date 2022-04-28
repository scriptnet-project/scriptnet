import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, Panel, PanelType, getTheme } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import { useCytoscape } from 'Hooks/Cytoscape';
import { AddPersonForm } from '../../Forms/AddPersonForm';
import SidePanel from './SidePanel';

const theme = getTheme();

const ViewDetailsPanel = ({
  isOpen,
}) => {
  const { cy, id } = useCytoscape();
  const selectedElement = useSelector(getSelectedId);
  const dispatch = useDispatch();
  const form = useRef(null);

  const handleRemove = useCallback(() => {
    if (!selectedElement) { return; }
    cy.current.getElementById(selectedElement).remove();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  const handleDismiss = useCallback(() => {
    cy.current.getElementById(selectedElement).unselect();
    dispatch(visualisationActions.clearSelected());
  }, [selectedElement, id]);

  if (!cy.current) { return null; }

  const details = cy.current.getElementById(selectedElement).data();

  if (!isOpen || !details) { return false; }

  const submitHandler = () => {
    if (form.current) {
      form.current.handleSubmit()
    }
  }

  return (
      <SidePanel
        isOpen={isOpen}
        handleDismiss={handleDismiss}
        title="Details"
      >
        <AddPersonForm
          initialValues={details}
          isUpdate
          formRef={form}
        />
      </SidePanel>
  );
}

export default ViewDetailsPanel;
