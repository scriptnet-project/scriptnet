import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Screen.scss';

const createScreenElement = () => {
  const el = document.createElement('div');
  el.setAttribute('class', 'screen');
  return el;
};

const Screen = ({ children, index, panel }) => {
  const portal = useRef(createScreenElement());

  useEffect(() => {
    const parent = document.getElementsByTagName('body')[0];
    portal.current.setAttribute('style', `z-index: ${index}`);
    parent.appendChild(portal.current);

    return function () {
      parent.removeChild(portal.current);
    };
  }, [index]);

  return portal.current && ReactDOM.createPortal(children, portal.current);
};

Screen.defaultProps = {
  index: 1,
};

export default Screen;
