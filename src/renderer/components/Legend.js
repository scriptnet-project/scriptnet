import React from 'react';
import { useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { motion } from 'framer-motion';
import { getTheme, Text } from '@fluentui/react';
import { modes } from 'Store/mode';
import 'Components/Legend.scss';

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
  ...edges,
];

const scenes = [
  { type: 'scene', label: 'preparation', color: '#ffb90033' },
  { type: 'scene', label: 'pre-activity', color: '#e7485633' },
  { type: 'scene', label: 'activity', color: '#0078d733' },
  { type: 'scene', label: 'post-activity', color: '#6b69d633' },
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
        <p className="Legend__element">
          <div className="Legend__pip" style={{ backgroundColor: options.color }} />
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
        className="Legend"
        whileHover={{ opacity: 0.1 }}
        id="legend"
        layout
      >
        {Object.keys(elements).map((group) => (
          <div className="Legend__group" key={group}>
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
