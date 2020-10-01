import React, { Children } from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Text,
  Stack,
} from '@fluentui/react';
import { AnimatePresence, motion } from 'framer-motion';
import './Panel.scss';

const Panel = ({
  isOpen,
  onDismiss,
  headerText,
  children
}) => {
  const variants = {
    show: {
      x: 0,
      transition: {
        ease: [0.76, 0, 0.24, 1],
        duration: 0.5,
      },
    },
    hide: {
      x: '-100%',
    },
  }
  return(
    <AnimatePresence>
      { isOpen && (
        <motion.div
          variants={variants}
          initial="hide"
          animate="show"
          exit="hide"
          className="panel"
        >
          <Stack tokens={{ childrenGap: 10 }}>
            <Text variant={'large'} block>
              {headerText}
            </Text>
            {children}
          </Stack>
          <footer>
            <PrimaryButton text="Close" onClick={onDismiss}/>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Panel;
