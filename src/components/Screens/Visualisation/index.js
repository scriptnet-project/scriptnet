import React from 'react';
import Screen from 'components/Screen';
import Visualisation from './Visualisation';
import Panels from './Panels';

const VisualisationScreen = () => (
  <Screen>
    <Panels />
    <Visualisation />
  </Screen>
);

export default VisualisationScreen;
