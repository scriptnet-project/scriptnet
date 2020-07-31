import React from 'react';
import { motion } from 'framer-motion';
import { animation } from 'config';
import './Screen.scss';

const transition = {
  duration: animation.duration.slow,
};

const variants = {
  start: { opacity: 0, scaleX: 1.1, scaleY: 1.1, transition },
  in: { opacity: 1, scaleX: 1, scaleY: 1, transition },
  out: { opacity: 0, scaleX: 0.8, scaleY: 0.8, transition },
};

const Screen = ({ index, children }) => (
  <motion.div
    initial="start"
    animate="in"
    exit="out"
    variants={variants}
    className="Screen"
    style={{ zIndex: index }}
  >
    {children}
  </motion.div>
);

export default Screen;
