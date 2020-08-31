import React, { useRef, useEffect } from 'react';
import useCytoscape from './useCytoscape';

/**
 * Render cytoscape from the closest Provider
 */
const Cytoscape = (props) => {
  const cyContainer = useRef();
  const cy = useCytoscape();

  useEffect(() => {
    if (cyContainer.current) {
      cy.mount(cyContainer.current);
    }

    return () => {
      cy.unmount(cyContainer.current);
    };
  }, [cyContainer.current]);

  return <div ref={cyContainer} {...props} />;
};

export default Cytoscape;
