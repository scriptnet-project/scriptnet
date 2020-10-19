import React from 'react';
import {
  PrimaryButton,
  Text,
  Stack,
} from '@fluentui/react';
import { AnimatePresence, motion } from 'framer-motion';
import './Panel.scss';

const Panel = ({
  name,
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
      transition: {
        ease: [0.76, 0, 0.24, 1],
        duration: 0.5,
      },
    },
  }
  return(
      <AnimatePresence>
        { isOpen && (
        <motion.div
          key={name}
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
