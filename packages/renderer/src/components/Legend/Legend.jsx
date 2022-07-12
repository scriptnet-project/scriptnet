import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { motion } from 'framer-motion';
import { getTheme, StackItem, Text, Stack, Toggle, DefaultButton, Slider, Icon, Callout, Checkbox} from '@fluentui/react';
import InvolvementSlider from './InvolvementSlider';
import AutomaticLayoutToggle from './AutomaticLayoutToggle';
import { modes } from 'Store/mode';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import './Legend.scss';
import useCytoscape from '@/hooks/Cytoscape';
import IconWithCallout from '../IconWithCallout';
import ShowMapToggle from './ShowMapToggle';

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

const ShowLabelToggle = () => {
  const showLabels = useSelector(state => state.visualisation.showLabels);
  const dispatch = useDispatch();
  const toggleShowLabels = () => dispatch(visualisationActions.toggleShowLabels());

  return (
    <Toggle
      label="Show Labels"
      inlineLabel
      checked={showLabels}
      onChange={toggleShowLabels}
    />
    )
};

const LegendDivider = () => (
  <StackItem>
    <hr style={{ border: '1px solid #ccc' }}/>
  </StackItem>
);

const LegendItem = ({ type, label, editable, ...options }) => {
  if (editable) {
    return (
      <Checkbox
        label={
          <span className="Legend__element">
            <span className={`glyph glyph--${options.glyph}`} style={{ '--color': options.color }}/>
            {label}
          </span>
        }
      />
    );
  }

  return (
    <p className="Legend__element">
      <span className={`glyph glyph--${options.glyph}`} style={{ '--color': options.color }}/>
      {label}
    </p>
  );
};

const Legend = () => {
  const { cy } = useCytoscape();
  const { mode, options } = useSelector(state => state.mode);

  // Determine which elements to display in the legend based on the mode.
  // When in edit mode:
  //  - Display node, edge, and scene keys, but don't allow deselecting
  const getElements = (mode, options) => {
    if (mode === modes.VISUALISE) {
      // Enable checkboxes so these can be deselected
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

    return [...nodes, ...relationships, ...scenes];
  };

  const elements = groupBy(getElements(mode, options), 'type');

  const Group = ({group}) => {
    console.log(group);
    return (
      <Stack
        key={group}
        tokens={{
          childrenGap: '10px',
          padding: '10px',
        }}
      >
        <Checkbox
          label={<Text style={{ textTransform: 'capitalize', fontWeight: 'bold', margin: '20px'}} >{group}</Text>}
          indeterminate
          inlineLabel
        />
        {elements[group].map(elementProps => (<LegendItem {...elementProps} key={elementProps.label} editable />))}
        <LegendDivider />
      </Stack>
    )
  }

  return (
      <div
        className="Legend"
        id="legend"
        layout
        style={{
          boxShadow: theme.effects.elevation16,
          background: theme.semanticColors.bodyBackground,
          zIndex: 9999,
        }}
      >
        <Stack
          tokens={{
            childrenGap: '10px',
            padding: '10px',
          }}
        >
          <StackItem>
          {Object.keys(elements).map((group) => <Group key={group} group={group} editable />)}
          </StackItem>
          <AutomaticLayoutToggle />
          <ShowLabelToggle />
          <ShowMapToggle />
          <LegendDivider />
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
              Centre View
            </DefaultButton>
          </StackItem>
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
              Export Screenshot
            </DefaultButton>
          </StackItem>
          <LegendDivider />
          <InvolvementSlider />
        </Stack>
      </div>
  );
 };

export default Legend;
