import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import { useCytoscape } from '../../../hooks/Cytoscape';
import { actionCreators as modeActions } from '../../../store/mode';
import { baseJurisdictionOptions } from '../../Forms/sharedOptions';
import SidePanel from './SidePanel';

const JurisdictionPresetPanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const hideJurisdiction = useSelector(s => s.mode.options.hideJurisdiction);
  const dispatch = useDispatch();

  const onChange = useCallback((event, value) => {
    console.log('changed:', value, event, event.target.name);

    // Deselecting means adding to hideJurisdiction
    if (!value) {
      dispatch(modeActions.setOption('hideJurisdiction', [
        ...hideJurisdiction || [],
        event.target.name,
      ]));
      return;
    }

    // Otherwise we are selecting, so remove from hideJurisdiction
    dispatch(modeActions.setOption('hideJurisdiction', [
      ...hideJurisdiction.filter(scene => scene !== event.target.name),
    ]));
  }, [id, hideJurisdiction]);

  const isChecked = name => !(hideJurisdiction && hideJurisdiction.includes(name));

  return (
    <SidePanel
      isOpen={isOpen}
      handleDismiss={onDismiss}
      title="Jurisdiction Visualisation Mode"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in jurisdiction visualisation mode. When in this mode, a container is drawn around the nodes you have named, based on the jurisdiction that you identified.</Text>
        <Text>Below, you can toggle the display of each jurisdiction to help create a clearer picture of the groups.</Text>
        { baseJurisdictionOptions.map(jurisdiction => (
          <Checkbox key={jurisdiction.key} name={jurisdiction.key} label={jurisdiction.text} checked={isChecked(jurisdiction.key)} onChange={onChange} />
        ))}
      </Stack>
    </SidePanel>
  );
}

export default JurisdictionPresetPanel;
