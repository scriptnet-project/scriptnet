import {
  CommandBar,
  Toggle,
} from '@fluentui/react';
// @ts-ignore:next-line
import { useCytoscape } from '../../hooks/Cytoscape';
import './CommandBar.scss';
// @ts-ignore:next-line
import { actionCreators as visualisationActions } from '../../store/visualisation';
import { useDispatch, useSelector } from 'react-redux';
import ShowMapToggle from '../Legend/ShowMapToggle';
import AutomaticLayoutToggle from '../Legend/AutomaticLayoutToggle';
import './CommandBar.scss';
import { get } from 'lodash';

const ShowLabelToggle = () => {
  const showLabels = useSelector(state => get(state, 'visualisation.showLabels'));
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

const TopCommandBar = ({
}) => {
  const { cy, id } = useCytoscape();

  const farItems = [
    {
      key: 'map',
      commandBarButtonAs: ShowMapToggle,
    },
    {
      key: 'labels',
      commandBarButtonAs: ShowLabelToggle,
    },
    {
      key: 'layout',
      commandBarButtonAs: AutomaticLayoutToggle,
    },
    {
      key: 'fit',
      text: 'Center view',
      iconProps: { iconName: 'ZoomToFit' },
      onClick: () => cy.current.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 500
      }),
    }
  ];

  return (
    <div className="CommandBar">
      <CommandBar
        items={[]}
        farItems={farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
    </div>
  );
};

export default TopCommandBar;

