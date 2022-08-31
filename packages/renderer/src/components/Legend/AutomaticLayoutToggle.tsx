import { useDispatch, useSelector } from 'react-redux';
import { Toggle } from '@fluentui/react';
// @ts-ignore:next-line
import { actionCreators as visualisationActions } from '../../store/visualisation';
import { get } from 'lodash';

const AutomaticLayoutToggle = () => {
  const automaticLayout = useSelector(state => get(state, 'visualisation.automaticLayout'));
  const showMap = useSelector(state => get(state, 'visualisation.showMap'));
  const dispatch = useDispatch();
  const toggleAutomaticLayout = () => dispatch(visualisationActions.toggleAutomaticLayout());

  return (
      <Toggle
        label="Automatically Position"
        inlineLabel
        disabled={showMap}
        checked={automaticLayout}
        onChange={toggleAutomaticLayout}
      />
  )
}

export default AutomaticLayoutToggle;
