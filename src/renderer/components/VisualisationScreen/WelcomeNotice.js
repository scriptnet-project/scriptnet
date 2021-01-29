import React, { useState } from 'react';
import {
  FontWeights,
  getTheme,
  IconButton,
  mergeStyleSets,
  Modal,
  PrimaryButton,
} from '@fluentui/react';

const initialOpenState = true;

const theme = getTheme();
const cancelIcon = { iconName: 'Cancel' };
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});

const WelcomeNotice = () => {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  const handleDismiss = () => setIsOpen(false);

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      isBlocking={false}
      containerClassName="launch-modal"
    >
      <div className={contentStyles.header}>
        <span>ScriptNet</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close welcome notice"
          onClick={handleDismiss}
        />
      </div>
      <div className={contentStyles.body}>
        <p>Welcome to ScriptNet, a software package for analysing the interfaces of the crime
        commission process and networks of association. The software is a collaboration between
        the University of Manchester (Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo), Joshua
        Melville, and Steve McKellar (Team Garlic). More specifically:</p>

        <ul>
          <li>Content developed by Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo</li>
          <li>Software developed by Joshua Melville and Steve McKellar</li>
        </ul>

        <p>The project, entitled ‘In Pursuit of Food System Integrity: Scoping and Development of the
        SCRIPTNET Tool-Kit’, was funded by the Economic and Social Research Council Impact
        Acceleration Account.</p>

        <p>Cite as follows:</p>

        <ul>
          <li>Lord, N., Bellotti, E., Flores-Elizondo, C., Melville, J. and McKellar, S. (2020) ScriptNet: An
        Integrated Criminological-Network Analysis Tool, University of Manchester.</li>
        </ul>
        <PrimaryButton
          onClick={handleDismiss}
        >Continue</PrimaryButton>
      </div>
    </Modal>
  );
  // return (
  // <AnimatePresence>
  //   { openState &&
  //     <motion.div
  //       initial={{ opacity: 1 }}
  //       animate={{ opacity: 1 }}
  //       exit={{ opacity: 0 }}
  //       onClick={handleClose}
  //     >
  //       Welcome to ScriptNet, a software package for analysing the interfaces of the crime
  //       commission process and networks of association. The software is a collaboration between
  //       the University of Manchester (Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo), Joshua
  //       Melville and Steve McKellar (Team Garlic). More specifically:

  //       - Content developed by Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo
  //       - Software developed by Joshua Melville and Steve McKellar

  //       The project, entitled ‘In Pursuit of Food System Integrity: Scoping and Development of the
  //       SCRIPTNET Tool-Kit’, was funded by the Economic and Social Research Council Impact
  //       Acceleration Account.

  //       Cite as follows:
  //       - Lord, N., Bellotti, E., Flores-Elizondo, C., Melville, J. and McKellar, S. (2020) ScriptNet: An
  //       Integrated Criminological-Network Analysis Tool, University of Manchester.
  //     </motion.div>
  //   }
  // </AnimatePresence>
  // );
};

export default WelcomeNotice;
