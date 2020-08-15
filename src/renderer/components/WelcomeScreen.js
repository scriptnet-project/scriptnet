import React from 'react';
import Screen from './Screen';

const WelcomeScreen = () => (
  <Screen>
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'blue' }}>
      Welcome
    </div>
  </Screen>
);

export default WelcomeScreen;
