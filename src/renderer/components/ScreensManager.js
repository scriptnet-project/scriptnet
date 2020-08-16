import React from 'react';
import { AnimatePresence } from 'framer-motion';
import VisualisationScreen from 'Components/VisualisationScreen';
import './Screens.scss';

const getScreen = (name) => ({
  default: <VisualisationScreen key="visualisation" />,
}[name]);

const ScreensManager = ({ screenName = "default" }) => (
  <div className="Screens">
    <AnimatePresence>
      { getScreen(screenName) }
    </AnimatePresence>
  </div>
);

export default ScreensManager;
