import { getTheme, IconButton, PrimaryButton } from "@fluentui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import useCytoscape, { useCytoscapeActions } from "../hooks/Cytoscape";
import { getSelectedEdge } from "../store/selectors/visualisation";
import { actionCreators } from "../store/visualisation";

const EdgeDeletePanel = () => {
  const dispatch = useDispatch();
  const cyActions = useCytoscapeActions();
  const { cy } = useCytoscape();
  const selectedEdge = useSelector(getSelectedEdge);

  const theme = getTheme();

  const handleCancel = () => {
    cy.current.edges().unselect();
    dispatch(actionCreators.clearSelected());
    cyActions.centerGraph();
  }

  return (
    <AnimatePresence>
      {selectedEdge && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 25 }}
          exit={{ opacity: 0, y: -100 }}
          style={{
            position: "absolute",
            top: "0",
            right: "50%",
            marginRight: -100,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: "100",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "200px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
            border: "1px solid #ccc",
          }}
        >
          <PrimaryButton
            iconProps={{ iconName: 'delete', children: theme.palette.red }}
            style={{ backgroundColor: theme.palette.red, color: 'white' }}
            onClick={() => {
              cyActions.remove(selectedEdge);
              handleCancel();
            }}
          >
            Delete
          </PrimaryButton>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            onClick={handleCancel}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
};

export default EdgeDeletePanel;
