import { ThemeProvider, Panel, PanelType, getTheme } from '@fluentui/react';

const SidePanel = ({
  isOpen,
  title,
  handleDismiss,
  children,
}) => {
  const theme = getTheme();

  return (
    <ThemeProvider>
      <Panel
        name="view-details-panel"
        isOpen={isOpen}
        isLightDismiss
        type={PanelType.customNear}
        customWidth={400}
        isBlocking={false}
        onDismiss={handleDismiss}
        headerText={title}
        styles={{
          root: {
            ".ms-Panel-commands": {
              backgroundColor: theme.semanticColors.bodyBackground,
              zIndex: 999999,
            },
          }
        }}
      >
        {children}
      </Panel>
    </ThemeProvider>
  );
}

export default SidePanel;
