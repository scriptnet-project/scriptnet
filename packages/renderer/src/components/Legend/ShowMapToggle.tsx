import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StackItem, Text, Stack, Toggle } from '@fluentui/react';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import IconWithCallout from '../IconWithCallout';

const Callout = () => (
  <IconWithCallout
    content={
      <Stack
        tokens={{
          childrenGap: '10px',
          padding: '10px',
        }}
      >
        <StackItem block>
          Toggle between the default background, and a map of the world. When in map mode
          the position of the nodes will be determined by their location property.
        </StackItem>
        <StackItem block>
          <strong>Please note: </strong> nodes without a location will be hidden from the map.
        </StackItem>
      </Stack>
    }
    icon="info"
  />
);


// Toggle between map and default background
const ShowMapToggle = () => {
  const showMap = useSelector(state => state.visualisation.showMap);
  const dispatch = useDispatch();
  const toggleShowMap = () => dispatch(visualisationActions.toggleShowMap());

  const numberOfHiddenNodes = 4;

  return (
  <>
    <Toggle
      label={<div>Show Map <Callout /></div>}
      inlineLabel
      checked={showMap}
      onChange={toggleShowMap}
    />
    {showMap && (
      <Stack>
        <Text>{numberOfHiddenNodes} node(s) are currently hidden.</Text>
      </Stack>
    )}
  </>
  );
}

export default ShowMapToggle;
