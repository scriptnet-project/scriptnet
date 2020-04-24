import React from 'react';
import { motion } from 'framer-motion';
import './Screen.scss';

const screenVariants = {
  start: { opacity: 0, translateX: '-100%' },
  in: { opacity: 1, translateX: ['-100%', 0] },
  out: { opacity: 0, translateX: [0, '100%']  },
};

const Screen = ({ index, children }) => (
  <motion.div
    initial="start"
    animate="in"
    exit="out"
    variants={screenVariants}
    className="Screen"
    style={{ zIndex: index }}
  >
    {children}
  </motion.div>
);

export default Screen;
