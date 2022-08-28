import { useDispatch, useSelector } from 'react-redux';
import { StackItem, Stack, Toggle } from '@fluentui/react';
// @ts-ignore:next-line
import { actionCreators as visualisationActions } from '../../store/visualisation';
// @ts-ignore:next-line
import IconWithCallout from '../IconWithCallout';
import { get } from 'lodash';

const Callout = () => (
  <IconWithCallout
    content={
      <Stack
        tokens={{
          childrenGap: '10px',
          padding: '10px',
        }}
      >
        <StackItem
          // @ts-ignore:next-line
          block
        >
          Toggle between the default background, and a map of the world. When in map mode
          the position of the nodes will be determined by their location property.
        </StackItem>
        <StackItem
          // @ts-ignore:next-line
          block
        >
          <strong>Please note: </strong> nodes without a location will be hidden from the map.
        </StackItem>
      </Stack>
    }
    icon="info"
  />
);


// Toggle between map and default background
const ShowMapToggle = () => {
  const showMap = useSelector(state => get(state, 'visualisation.showMap'));
  const dispatch = useDispatch();
  const toggleShowMap = () => dispatch(visualisationActions.toggleShowMap());

  return (
  <>
    <Toggle
      label={<div>Show Map <Callout /></div>}
      inlineLabel
      checked={showMap}
      onChange={toggleShowMap}
    />
  </>
  );
}

export default ShowMapToggle;
