import React, { useState } from 'react';
import Screen from 'components/Screen';
import Visualisation from './Visualisation';
import Panel from './Panel';
import Panels from './Panels';

const VisualisationScreen = () => {
  const [mode, setMode] = useState('default');

  return (
    <Screen>
      <Panels mode={mode} />
      <Panel type="bottom" key="bottom-default">
        Choose a mode:
        <div className="clickable" onClick={() => setMode('default')}>default</div>
        <div className="clickable" onClick={() => setMode('foo')}>foo</div>
      </Panel>
      <Visualisation />
    </Screen>
  );
};

export default VisualisationScreen;
