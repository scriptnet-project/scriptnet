import React from 'react';
import { useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { motion } from 'framer-motion';
import { getTheme, Text } from '@fluentui/react';
import { modes } from 'Store/mode';

const theme = getTheme();

const edges = [
  { type: 'edge', label: 'personal', color: theme.palette.yellow },
  { type: 'edge', label: 'communication', color: theme.palette.purpleLight },
  { type: 'edge', label: 'financial', color: theme.palette.greenLight },
  { type: 'edge', label: 'business', color: theme.palette.tealLight },
  { type: 'edge', label: 'ownership', color: theme.palette.magentaLight },
];

const nodes = [
  { type: 'node', label: 'person', color: theme.palette.blue },
  { type: 'node', label: 'location', color: theme.palette.purple },
  { type: 'node', label: 'resource', color: theme.palette.tealLight },
  { type: 'node', label: 'organisation', color: theme.palette.orange },
];

const scenes = [
  { type: 'scene', label: 'preparation', color: theme.palette.blue },
  { type: 'scene', label: 'pre-activity', color: theme.palette.purple },
  { type: 'scene', label: 'activity', color: theme.palette.tealLight },
  { type: 'scene', label: 'post-activity', color: theme.palette.orange },
];

const getElements = (mode, options) => {
  if (mode === modes.CONFIGURE) {
    if (options.preset === 'scene') {
      return scenes;
    }

    if (options.preset === 'relationship-filter') {
      return edges;
    }

    return [...nodes, ...edges];
  }

  if (mode === modes.CREATE_EDGES) {
    return edges;
  }

  return nodes;
};

const Element = ({ type, label, ...options }) => {
  switch (type) {
    case 'node':
    case 'edge':
    default:
      return (
        <p style={{ textTransform: 'capitalize' }}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '10px', backgroundColor: options.color, marginRight: '5px' }} />
          {label}
        </p>
      );
  }
};

const Legend = () => {
  const { mode, options } = useSelector(state => state.mode);
  const elements = groupBy(getElements(mode, options), 'type');

  return (
      <motion.div
        style={{ zIndex: 5, position: 'absolute', top: '100px', right: '20px', padding: '0 20px', backgroundColor: 'rgba(255, 255, 255, 0.5)', translateX: '0px' }}
        whileHover={{ opacity: 0.1 }}
        id="legend"
        layout
      >
        {Object.keys(elements).map((group) => (
          <div key={group}>
            <Text>
              <h4 style={{ textTransform: 'capitalize'}}>{group}</h4>
              {elements[group].map(elementProps => <Element {...elementProps} />)}
            </Text>
          </div>
        ))}
      </motion.div>
  );
 };

export default Legend;
