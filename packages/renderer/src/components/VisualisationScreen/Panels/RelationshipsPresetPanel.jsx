import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Stack, Text } from '@fluentui/react';
import { useCytoscape } from '../../../hooks/Cytoscape';
import { actionCreators as modeActions } from '../../../store/mode';
import SidePanel from './SidePanel';

const RelationshipsPresetPanel = ({ isOpen, onDismiss }) => {
  const { id } = useCytoscape();
  const hideEdges = useSelector(s => s.mode.options.hideEdges);
  const dispatch = useDispatch();

  const onChange = useCallback((event, value) => {
    console.log('changed:', value, event, event.target.name);

    // Deselecting means adding to hideEdges
    if (!value) {
      dispatch(modeActions.setOption('hideEdges', [
        ...hideEdges || [],
        event.target.name,
      ]));
      return;
    }

    // Otherwise we are selecting, so remove from hideEdges
    dispatch(modeActions.setOption('hideEdges', [
      ...hideEdges.filter(scene => scene !== event.target.name),
    ]));
  }, [id, hideEdges]);

  const isChecked = name => !(hideEdges && hideEdges.includes(name));

  return (
    <SidePanel
      isOpen={isOpen}
      handleDismiss={onDismiss}
      title="Filter by Relationships"
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>You are now in filter by relationships mode. In this mode you can toggle the display of relationship
          types on and off, in order to better understand the structure of the network.</Text>
        <Checkbox name="personal" label="Personal" checked={isChecked('personal')} onChange={onChange} />
        <Checkbox name="communication" label="Communication" checked={isChecked('communication')} onChange={onChange} />
        <Checkbox name="financial" label="Financial" checked={isChecked('financial')} onChange={onChange} />
        <Checkbox name="business" label="Business" checked={isChecked('business')} onChange={onChange} />
        <Checkbox name="ownership" label="Ownership" checked={isChecked('ownership')} onChange={onChange} />
        <Checkbox name="working" label="Working" checked={isChecked('working')} onChange={onChange} />
      </Stack>
    </SidePanel>
  );
}

export default RelationshipsPresetPanel;
