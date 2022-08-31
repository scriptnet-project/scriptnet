import myTheme from '@/themes/panel';
import { ThemeProvider, Panel, PanelType, getTheme } from '@fluentui/react';

const SidePanel = ({
  isOpen,
  title,
  handleDismiss,
  children,
}) => {
  const theme = getTheme();

  return (
    <ThemeProvider theme={myTheme}>
      <Panel
        name="view-details-panel"
        isOpen={isOpen}
        isLightDismiss
        type={PanelType.customNear}
        customWidth={300}
        isBlocking={false}
        onDismiss={handleDismiss}
        headerText={title}
      >
        {children}
      </Panel>
    </ThemeProvider>
  );
}

export default SidePanel;
