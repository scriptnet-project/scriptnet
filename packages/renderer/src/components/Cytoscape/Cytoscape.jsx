import { useRef, useEffect } from 'react';
import { useCytoscape } from '../../hooks/Cytoscape';

/**
 * Render cytoscape from the closest Provider
 */
const Cytoscape = (props) => {
  const cyContainer = useRef();
  const { cy, id } = useCytoscape();

  useEffect(() => {
    if (!cyContainer.current || !cy.current) { return; }
    cy.current.mount(cyContainer.current);

    return () => {
      if (!cyContainer.current || cy.current) { return; }

      cy.current.unmount(cyContainer.current);
    };
  }, [!!cyContainer.current, id]);

  return <div id="cy" ref={cyContainer} {...props} className="cyContainer"/>;
};

export default Cytoscape;
