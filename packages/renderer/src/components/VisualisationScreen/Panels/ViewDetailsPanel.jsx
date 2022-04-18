import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, Panel, PanelType, getTheme } from '@fluentui/react';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { getSelectedId } from 'Store/selectors/visualisation';
import { useCytoscape } from 'Hooks/Cytoscape';
import { AddPersonForm } from '../../Forms/AddPersonForm';
import panelTheme from '../../../themes/panel';

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
    <ThemeProvider>
      <Panel
        name="view-details-panel"
        isOpen={isOpen}
        isLightDismiss
        type={PanelType.customNear}
        customWidth={400}
        isBlocking={false}
        onDismiss={handleDismiss}
        headerText="Details"
        styles={{
          root: {
            ".ms-Panel-commands": {
              backgroundColor: theme.semanticColors.bodyBackground,
              zIndex: 999999,
            },
          }
        }}
      >
        <AddPersonForm
          initialValues={details}
          isUpdate
          formRef={form}
        />
      </Panel>
    </ThemeProvider>
  );
}

export default ViewDetailsPanel;
