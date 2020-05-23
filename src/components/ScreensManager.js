import React from 'react';
import { AnimatePresence } from 'framer-motion';
import VisualisationScreen from 'components/VisualisationScreen';
import WelcomeScreen from 'components/WelcomeScreen';
import './Screens.scss';

const screens = {
  visualisation: <VisualisationScreen key="visualisation" />,
  default: <WelcomeScreen key="welcome" />,
};

const ScreensManager = ({ screen = "default" }) => (
  <div className="Screens">
    <AnimatePresence>
      { screens[screen] }
    </AnimatePresence>
  </div>
);

export default ScreensManager;
