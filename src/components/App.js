import React, { useState, useEffect, useRef } from 'react';
import VisualisationScreen from 'components/Screens/Visualisation';
import Modals from 'components/Modals';
import './App.scss';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [show, setShow] = useState(true);
  return [
    // <Modals />,
    (
      <div
        style={{ position: 'absolute', top: 0, right: 0, zIndex: 100 }}
        onClick={() => setShow((v) => !v)}
      >click</div>
    ),
    (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden'}}>
        <AnimatePresence>
          { show && <VisualisationScreen /> }
        </AnimatePresence>
      </div>
    )
  ];
}

export default App;
