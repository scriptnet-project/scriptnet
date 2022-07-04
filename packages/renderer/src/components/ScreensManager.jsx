import { AnimatePresence } from 'framer-motion';
import VisualisationScreen from '../components/VisualisationScreen';
import { getTheme } from '@fluentui/react';

const getScreen = (name) => ({
  default: <VisualisationScreen key="visualisation" />,
}[name]);

const ScreensManager = ({ screenName = "default" }) => {
  const theme = getTheme();
  return (
    <div
      className="Screens"
      style={{
        background: theme.semanticColors.bodyBackground,
      }}
    >
      <AnimatePresence>
        { getScreen(screenName) }
      </AnimatePresence>
    </div>
  );
}
export default ScreensManager;
