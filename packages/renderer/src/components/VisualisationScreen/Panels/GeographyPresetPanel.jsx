import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import { useCytoscape } from '../../../hooks/Cytoscape';
import { actionCreators as modeActions } from '../../../store/mode';
import { Panel } from './';
import { baseJurisdictionOptions } from '../../Forms/sharedOptions';

const GeographyPresetPanel = ({ isOpen, onDismiss }) => {
  const { cy, id } = useCytoscape();
  const showCountry = useSelector(s => s.mode.options.showCountry);
  const dispatch = useDispatch();

  const onChange = useCallback((event, value) => {

    if (!value) {
      dispatch(modeActions.setOption('showCountry', [
        ...showCountry.filter(scene => scene !== event.target.name),
      ]));

      return;
    }

    dispatch(modeActions.setOption('showCountry', [
      ...showCountry || [],
      event.target.name,
    ]));
  }, [id, showCountry]);

  const isChecked = name => showCountry && showCountry.includes(name);

  const countriesInUse = new Set();
  cy.current.nodes().forEach(node => {
    countriesInUse.add(node.data('location'));
  });

  return (
    <Panel
      name="assign-attributes-panel"
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Geographic Visualisation Mode"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in geographic visualisation mode. When in this mode, a container can be drawn around the nodes you have named, based on the country you said they were located in.</Text>
        <Text>Select one or more countries below to visualise nodes that are located within it.</Text>
        { [...countriesInUse].sort().map(country => (
          <Checkbox key={`${country}`} name={country} label={country} checked={isChecked(country)} onChange={onChange} />
        ))}
      </Stack>
    </Panel>
  );
}

export default GeographyPresetPanel;
