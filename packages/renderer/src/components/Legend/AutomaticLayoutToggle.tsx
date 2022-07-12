import { useDispatch, useSelector } from 'react-redux';
import { Toggle } from '@fluentui/react';
import { actionCreators as visualisationActions } from '../../store/visualisation';

const AutomaticLayoutToggle = () => {
  const automaticLayout = useSelector(state => state.visualisation.automaticLayout);
  const showMap = useSelector(state => state.visualisation.showMap);
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
