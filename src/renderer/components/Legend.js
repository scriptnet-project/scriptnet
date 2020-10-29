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


const getElements = (mode) => {
  switch(mode) {
    // add nodes
    case modes.VIEW_DETAILS:
      return [];
    // add edges
    case modes.CREATE_EDGES:
      return [
        ...edges,
      ];
    // Assign scenes
    case modes.ASSIGN_ATTRIBUTES:
      return [];
    // View presets
    case modes.CONFIGURE:
      return [];
    default:
      return [
        ...nodes,
        ...edges,
      ];
  }
};

const Element = ({ type, label, ...options }) => {
  switch (type) {
    case 'node':
    case 'edge':
      return (
        <p style={{ textTransform: 'capitalize' }}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '10px', backgroundColor: options.color, marginRight: '5px' }} />
          {label}
        </p>
      );
  }
};

const Legend = () => {
  const mode = useSelector(state => state.mode.mode);
  const elements = groupBy(getElements(mode), 'type');

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
