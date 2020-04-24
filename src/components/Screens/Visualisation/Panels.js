import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Panels.scss';

const sidePanelVariants = {
  'show': { translateX: 0, opacity: 1, transition: { duration: 1 } },
  'hide': { translateX: '-100%', opacity: 0, transition: { duration: 1 }  },
};

const bottomPanelVariants = {
  'show': { translateY: 0, opacity: 1, transition: { duration: 1 }  },
  'hide': { translateY: '100%', opacity: 0, transition: { duration: 1 }  },
};

const Panels = () => {
  const [set, setSet] = useState('default');
  const timer = useRef();
  const cb = useRef();

  const getPanels = (set) => {
    switch (set) {
      case 'foo':
        return [
          (
            <motion.div
            key="4"
            initial="hide"
            animate="show"
            exit="hide"
            variants={sidePanelVariants}
            className="Panels--side"
            style={{ background: 'purple' }}
            >
              FOOOO!
            </motion.div>
          ),
          (
            <motion.div key="3" initial="hide"
            animate="show"
            exit="hide" variants={bottomPanelVariants} className="Panels--bottom" style={{ background: 'orange' }}>
              FOOO!
            </motion.div>
          ),
        ];
      default:
        return [
          (
            <motion.div key="2" initial="hide"
            animate="show"
            exit="hide" variants={sidePanelVariants} className="Panels--side">
              BAR!
            </motion.div>
          ),
          (
            <motion.div key="1" initial="hide"
            animate="show"
            exit="hide" variants={bottomPanelVariants} className="Panels--bottom">
              bAR!
            </motion.div>
          ),
        ];
    }
  }

  useEffect(() => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setSet(set => set === 'foo' ? 'default' : 'foo');
    }, 3000);
  }, [timer, setSet, set]);

  return (
    <div>
      <motion.div
        initial="hide"
        animate="show"
        exit="out"
        className="Panels"
      >
        <AnimatePresence>
          {getPanels(set)}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Panels;
