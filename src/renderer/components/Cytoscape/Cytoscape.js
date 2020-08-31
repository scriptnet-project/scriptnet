import React, { useRef, useEffect } from 'react';
import Cytoscape from 'cytoscape';
import useCytoscape from './useCytoscape';

/**
 * Render cytoscape from the closest Provider
 */
const Cytoscape = () => {
  const cyContainer = useRef();
  const cy = useCytoscape();

  useEffect(() => {
    if (cyContainer.current) {
      cy.mount(cyContainer);
    }

    return () => {
      cy.unmount(cyContainer);
    };
  }, [cyContainer.current]);

  return <div ref={cyContainer} />;
};

export default Cytoscape;
