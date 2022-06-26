import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { groupBy, findIndex } from 'lodash';
import { motion } from 'framer-motion';
import { getTheme, StackItem, Text, Stack, Toggle, DefaultButton } from '@fluentui/react';
import { modes } from 'Store/mode';
import { actionCreators as visualisationActions } from '../store/visualisation';
import 'Components/Legend.scss';
import useCytoscape from '@/hooks/Cytoscape';

const CommandBarToggle = () => {
  const showLabels = useSelector(state => state.visualisation.showLabels);
  const dispatch = useDispatch();
  const toggleShowLabels = () => dispatch(visualisationActions.toggleShowLabels());

  return (
    <Toggle
    label="Show labels"
    inlineLabel
    checked={showLabels}
    onChange={toggleShowLabels}
  />
  )
};

const AutomaticLayoutToggle = () => {
  const automaticLayout = useSelector(state => state.visualisation.automaticLayout);
  const dispatch = useDispatch();
  const toggleAutomaticLayout = () => dispatch(visualisationActions.toggleAutomaticLayout());

  return (
      <Toggle
        label="Automatically Position"
        inlineLabel
        checked={automaticLayout}
        onChange={toggleAutomaticLayout}
      />
  )
}

const LegendItem = ({ type, label, ...options }) => {
  return (
    <motion.p layout className="Legend__element">
      <span className={`glyph glyph--${options.glyph}`} style={{ '--color': options.color }}/>
      {label}
    </motion.p>
  );
};

const Legend = () => {
  const { cy } = useCytoscape();
  const { mode, options } = useSelector(state => state.mode);
  const theme = getTheme();

  const relationships = [
    { glyph: 'line', type: 'relationships', label: 'personal', color: theme.palette.yellow },
    { glyph: 'line', type: 'relationships', label: 'communication', color: theme.palette.purpleLight },
    { glyph: 'line', type: 'relationships', label: 'financial', color: theme.palette.greenLight },
    { glyph: 'line', type: 'relationships', label: 'business', color: theme.palette.tealLight },
    { glyph: 'line', type: 'relationships', label: 'ownership', color: theme.palette.magentaLight },
    { glyph: 'line', type: 'relationships', label: 'working', color: theme.palette.red },
  ];

  const nodes = [
    { glyph: 'circle', type: 'node types', label: 'person', color: theme.palette.blue },
    { glyph: 'square', type: 'node types', label: 'location', color: theme.palette.purple },
    { glyph: 'triangle', type: 'node types', label: 'resource', color: theme.palette.tealLight },
    { glyph: 'diamond', type: 'node types', label: 'organisation', color: theme.palette.orange },
  ];

  const scenes = [
    { glyph: 'group', type: 'scenes', label: 'preparation', color: '#ffb90033' },
    { glyph: 'group', type: 'scenes', label: 'pre-activity', color: '#e7485633' },
    { glyph: 'group', type: 'scenes', label: 'activity', color: '#0078d733' },
    { glyph: 'group', type: 'scenes', label: 'post-activity', color: '#6b69d633' },
  ];

  const jurisdictions = [
    { glyph: 'group', type: 'jurisdiction', label: 'local', color: '#ffb90033' },
    { glyph: 'group', type: 'jurisdiction', label: 'regional', color: '#e7485633' },
    { glyph: 'group', type: 'jurisdiction', label: 'national', color: '#0078d733' },
    { glyph: 'group', type: 'jurisdiction', label: 'Transnational', color: '#6b69d633' },
  ];

  const getElements = (mode, options) => {
    if (mode === modes.CONFIGURE) {
      if (options.preset === 'scene') {
        return scenes;
      }

      if (options.preset === 'relationship-filter') {
        return relationships;
      }

      if (options.preset === 'jurisdiction') {
        return jurisdictions;
      }

      if (options.preset === 'geography') {
        return null;
      }

      return [...relationships, ...nodes];
    }

    if (mode === modes.CREATE_EDGES) {
      return relationships;
    }

    return [...relationships, ...nodes];
  };

  const elements = groupBy(getElements(mode, options), 'type');

  return (
      <motion.div
        className="Legend"
        id="legend"
        drag
        layout
        style={{
          boxShadow: theme.effects.elevation16,
          background: theme.semanticColors.bodyBackground,
          zIndex: 9999,
          cursor: 'move',
        }}
      >
        <Stack
          styles={{ root: { margin: '20px' } }}
        >
          <StackItem>
          {Object.keys(elements).map((group) => (
            <div className="Legend__group" key={group}>
              <Text>
                <h4 style={{ textTransform: 'capitalize'}}>{group}</h4>
                {elements[group].map(elementProps => (<LegendItem {...elementProps} key={elementProps.label} />))}
              </Text>
            </div>
          ))}
          </StackItem>
          {/* Divider */}
          <StackItem>
            <hr style={{ border: '1px solid #ccc' }}/>
          </StackItem>
          <AutomaticLayoutToggle />
          <CommandBarToggle />
          <StackItem>
            <DefaultButton
              iconProps={ { iconName: 'ZoomToFit' } }
              onClick={() => cy.current.animate({
                fit: {
                  eles: 'node',
                  padding: 100,
                }
              }, {
                duration: 500
              })}
            >
              Center View
            </DefaultButton>
          </StackItem>
        </Stack>
      </motion.div>
  );
 };

export default Legend;
