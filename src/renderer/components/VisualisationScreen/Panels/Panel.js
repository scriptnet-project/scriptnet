import React, { useEffect } from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Text,
  Stack,
} from '@fluentui/react';
import { AnimatePresence, motion } from 'framer-motion';
import './Panel.scss';
import useCytoscape from '../../../hooks/useCytoscape';

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
      transition: {
        ease: [0.76, 0, 0.24, 1],
        duration: 0.5,
      },
    },
  }

  const [, cyActions] = useCytoscape();

  useEffect(() => {
    console.log('panel effect');
    cyActions.recalculateSize();
  }, [isOpen])

  if (!isOpen) return false;

  return(
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
  );
}

export default Panel;
