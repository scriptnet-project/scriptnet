import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useCytoscape from '../hooks/useCytoscape';

/**
 * Render cytoscape from the closest Provider
 */
const Cytoscape = (props) => {
  const cyContainer = useRef();
  const [cy] = useCytoscape();

  useEffect(() => {
    if (cyContainer.current) {
      cy.mount(cyContainer.current);
    }

    return () => {
      cy.unmount(cyContainer.current);
    };
  }, [cyContainer.current]);

  return <motion.div layout ref={cyContainer} {...props} className="cyContainer"/>;
};

export default Cytoscape;
