import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Panel from './Panel';

const panelModes = {
  foo: [
    <Panel type="side" key="side-1" style={{ background: 'silver' }}>Side 1</Panel>,
    // <Panel type="bottom" key="bottom-1">Bottom 1</Panel>
  ],
  default: [
    <Panel type="side" key="side-default">Side default</Panel>,
    // <Panel type="bottom" key="bottom-default">Bottom default</Panel>
  ],
};

const getPanels = (mode) =>
  panelModes[mode];

const Panels = ({ mode }) => {
  return (
    <AnimatePresence>
      {getPanels(mode)}
    </AnimatePresence>
  );
};

export default Panels;
