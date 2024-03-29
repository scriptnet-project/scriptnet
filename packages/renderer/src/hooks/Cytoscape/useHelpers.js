import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

const gridSize = 100;

const getCenter = (cy) => {
  if (!cy.current) { return null; }

  const elements = cy.current.elements();

  // if no elements, return center of viewport
  if (elements.length === 0) {
    const pan = cy.current.pan();
    const width = cy.current.width();
    const height = cy.current.height();

    return {
      x: Math.round(pan.x + width * 0.5),
      y: Math.round(pan.y + height * 0.5),
    };
  }

  const bb = elements.boundingBox();

  return {
    x: Math.round(bb.x1 + bb.w * 0.5),
    y: Math.round(bb.y1 + bb.h * 0.5),
  };
}

const getNextPosition = (cy, count) => {
  if (!cy.current) { return {}; }

  const pan = cy.current.pan();
  const width = cy.current.width();
  const height = cy.current.height();

  const xGridSize = Math.floor(width / gridSize);
  const yGridSize = Math.floor(height / gridSize);

  const gridY = (1 + Math.floor(count / xGridSize)) % yGridSize;
  const gridX = 1 + (count % xGridSize);

  return {
    next: count + 1,
    x: -pan.x + gridX * gridSize,
    y: -pan.y + gridY * gridSize,
  };
};

const useHelpers = (cy, id) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if(!cy.current) { return; }
    const resetCount = throttle(() => setCount(0), 50);

    cy.current.on('viewport', resetCount);
    // cy.current.on('resize', () => setCount(0));

    return () => {
      if (!cy.current);
      cy.current.off('viewport', resetCount);
    };
  }, [id, setCount]);

  const add = (element) => {
    if (!cy.current) { return; }

    const { next, ...position } = getNextPosition(cy, count);

    cy.current.add({
      ...element,
      position,
    });

    setCount(next);
  };

  const update = (id, data) => {
    if (!cy.current) { return; }

    cy.current.elements(`#${id}`).data(data);
  };

  const remove = (id) => {
    if (!cy.current) { return; }
    cy.current.getElementById(id).remove();
  };

  const centerGraph = () => {
    if (!cy.current) { return; }

    cy.current.animate({
      fit: {
        eles: 'node',
        padding: 200,
      },
      center: { x: 200, y: 100 },
    }, {
      duration: 200
    });
  }

  const actions = {
    add,
    update,
    remove,
    centerGraph,
  };

  return [actions];
};

export default useHelpers;
