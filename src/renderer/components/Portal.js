import { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const createRootElement = () => {
  const el = document.createElement('div');
  el.setAttribute('class', 'screen');
  return el;
};

const Portal = ({ children, index, panel }) => {
  const portal = useRef(createRootElement());

  useEffect(() => {
    const p = portal.current;
    const parent = document.getElementsByTagName('body')[0];
    p.setAttribute('style', `z-index: ${index}`);
    parent.appendChild(p);

    return () => {
      parent.removeChild(p);
    };
  }, [index]);

  return portal.current && ReactDOM.createPortal(children, portal.current);
};

Portal.defaultProps = {
  index: 1,
};

export default Portal;
