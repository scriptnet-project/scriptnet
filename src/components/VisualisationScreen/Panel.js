import React from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import { animation } from 'config';
import './Panel.scss';

const transition = {
  duration: animation.duration.default,
};

const variants = {
  side: {
    'initial': { translateX: '-100%', opacity: 0, transition, },
    'enter': { translateX: ['-100%', 0], opacity: 1, transition, },
    'exit': { translateX: 0, opacity: 0, transition,  },
  },
  bottom: {
    'initial': { translateY: '100%', opacity: 0, transition, },
    'enter': { translateY: ['100%', 0], opacity: 1, transition, },
    'exit': { translateY: 0, opacity: 0, transition,  },
  },
  window: {
    'initial': { translateY: '100%', translateX: '-50%', opacity: 0, transition, },
    'enter': { translateY: ['100%', '-50%'], translateX: '-50%', opacity: 1, transition, },
    'exit': { translateY: 0, translateX: '-50%', opacity: 0, transition,  },
  },
};

const Panel = ({
  type,
  initial = "initial",
  animate = "enter",
  exit = "exit",
  className,
  children,
  ...props
}) => {
  const classes = cx('Panel', className, `Panel--${type}`);

  return (
    <motion.div
      initial="initial"
      animate={animate}
      exit="exit"
      variants={variants[type]}
      className={classes}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Panel;
