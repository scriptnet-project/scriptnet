import React from 'react';
import { useSelector } from 'react-redux';
import { groupBy, findIndex } from 'lodash';
import { motion } from 'framer-motion';
import { getTheme, Text } from '@fluentui/react';
import { modes } from 'Store/mode';
import 'Components/Legend.scss';
import { baseLocationOptions } from './Forms/sharedOptions';


const theme = getTheme();

const edges = [
  { glyph: 'line', type: 'edge', label: 'personal', color: theme.palette.yellow },
  { glyph: 'line', type: 'edge', label: 'communication', color: theme.palette.purpleLight },
  { glyph: 'line', type: 'edge', label: 'financial', color: theme.palette.greenLight },
  { glyph: 'line', type: 'edge', label: 'business', color: theme.palette.tealLight },
  { glyph: 'line', type: 'edge', label: 'ownership', color: theme.palette.magentaLight },
  { glyph: 'line', type: 'edge', label: 'working', color: theme.palette.red },
  { glyph: 'line', type: 'edge', label: 'geographical', color: theme.palette.neutralSecondaryAlt },
];

const nodes = [
  { glyph: 'circle', type: 'node', label: 'person', color: theme.palette.blue },
  { glyph: 'square', type: 'node', label: 'location', color: theme.palette.purple },
  { glyph: 'triangle', type: 'node', label: 'resource', color: theme.palette.tealLight },
  { glyph: 'diamond', type: 'node', label: 'organisation', color: theme.palette.orange },
];

const scenes = [
  { glyph: 'group', type: 'scene', label: 'preparation', color: '#ffb90033' },
  { glyph: 'group', type: 'scene', label: 'pre-activity', color: '#e7485633' },
  { glyph: 'group', type: 'scene', label: 'activity', color: '#0078d733' },
  { glyph: 'group', type: 'scene', label: 'post-activity', color: '#6b69d633' },
];

const jurisdictions = [
  { glyph: 'group', type: 'jurisdiction', label: 'local', color: '#ffb90033' },
  { glyph: 'group', type: 'jurisdiction', label: 'regional', color: '#e7485633' },
  { glyph: 'group', type: 'jurisdiction', label: 'national', color: '#0078d733' },
  { glyph: 'group', type: 'jurisdiction', label: 'Transnational', color: '#6b69d633' },
];

const getGeographyLegend = (showCountries) => {
  if (!showCountries) return;

  const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
  ];

  return showCountries.map((country) => {
    const colorIndex = findIndex(baseLocationOptions, ['text', country]);
    return { glyph: 'group', type: 'country', label: country, color: colors[colorIndex % 10]}
  })

}

const getElements = (mode, options) => {
  if (mode === modes.CONFIGURE) {
    if (options.preset === 'scene') {
      return scenes;
    }

    if (options.preset === 'relationship-filter') {
      return edges;
    }

    if (options.preset === 'jurisdiction') {
      return jurisdictions;
    }

    if (options.preset === 'geography') {
      return getGeographyLegend(options.showCountry);
    }

    return [...edges, ...nodes];
  }

  if (mode === modes.CREATE_EDGES) {
    return edges;
  }

  return [...edges, ...nodes];
};

const LegendItem = ({ type, label, ...options }) => {
  return (
    <motion.p layout className="Legend__element">
      <span className={`glyph glyph--${options.glyph}`} style={{ '--color': options.color }}/>
      {label}
    </motion.p>
  );
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
              {elements[group].map(elementProps => (<LegendItem {...elementProps} key={elementProps.label} />))}
            </Text>
          </div>
        ))}
      </motion.div>
  );
 };

export default Legend;
