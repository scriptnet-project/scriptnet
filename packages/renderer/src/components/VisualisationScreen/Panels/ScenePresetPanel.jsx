import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, ChoiceGroup, DefaultButton, Stack, Text } from '@fluentui/react';
import { useCytoscape } from '../../../hooks/Cytoscape';
import { actionCreators as modeActions } from '../../../store/mode';
import SidePanel from './SidePanel';

const ScenePresetPanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const hideScenes = useSelector(s => s.mode.options.hideScenes);
  const dispatch = useDispatch();

  const onChange = useCallback((event, value) => {
    // Deselecting means adding to hideScenes
    if (!value) {
      dispatch(modeActions.setOption('hideScenes', [
        ...hideScenes || [],
        event.target.name,
      ]));
      return;
    }

    // Otherwise we are selecting, so remove from hideScenes
    dispatch(modeActions.setOption('hideScenes', [
      ...hideScenes.filter(scene => scene !== event.target.name),
    ]));
  }, [id, hideScenes]);

  const isChecked = name => !(hideScenes && hideScenes.includes(name));

  return (
    <SidePanel
      name="assign-attributes-panel"
      isOpen={isOpen}
      handleDismiss={onDismiss}
      title="Scene Visualisation Mode"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in scene visualisation mode. When in this mode, a container is drawn around the nodes you have named, based on the "scenes" that each node was involved in.</Text>
        <Text>Below, you can toggle the display of each scene to help create a clearer picture of the groups.</Text>
        <Checkbox name="preparation" label="Preparation" checked={isChecked('preparation')} onChange={onChange} />
        <Checkbox name="pre-activity" label="Pre-Activity" checked={isChecked('pre-activity')} onChange={onChange} />
        <Checkbox name="activity" label="Activity" checked={isChecked('activity')} onChange={onChange} />
        <Checkbox name="post-activity" label="Post-Activity" checked={isChecked('post-activity')} onChange={onChange} />
      </Stack>
    </SidePanel>
  );
}

export default ScenePresetPanel;
