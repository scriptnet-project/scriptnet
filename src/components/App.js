import React, { useState, useEffect, useRef } from 'react';
import Screen from 'components/Screen';
import ModalManager from 'components/ModalManager';
import './App.scss';

function App() {
  return [
    <ModalManager />,
    <Screen>
      <div className="layout">
        <div className="layout__main">
          {/* <PanelManager />
          <Visualisation /> */}
        </div>
        <div className="layout__start-bar">
          {/* <ControlBar /> */}
        </div>
      </div>
    </Screen>,
  ];
}

export default App;
