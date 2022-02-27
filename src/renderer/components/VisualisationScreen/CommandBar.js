import React from 'react';
import {
  CommandBar,
  Toggle,
} from '@fluentui/react';
import { useCytoscape, useCytoscapeActions } from 'Hooks/Cytoscape';
import './CommandBar.scss';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import { useDispatch, useSelector } from 'react-redux';

const CommandBarToggle = () => {
  const showLabels = useSelector(state => state.visualisation.showLabels);
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

const AutomaticLayoutToggle = () => {
  const automaticLayout = useSelector(state => state.visualisation.automaticLayout);
  const dispatch = useDispatch();
  const toggleAutomaticLayout = () => dispatch(visualisationActions.toggleAutomaticLayout());

  return (
      <Toggle
        label="Automatically Position"
        inlineLabel
        checked={automaticLayout}
        onChange={toggleAutomaticLayout}
      />
  )
}

const TopCommandBar = ({
}) => {
  const { cy } = useCytoscape();

  const {
    newNetwork,
    saveNetwork,
    openNetwork,
    exportPNG,
    exportCSV,
  } = useCytoscapeActions();

  const items = [
    {
      key: 'Cases',
      text: 'Cases',
      iconProps: { iconName: 'Album' },
      subMenuProps: {
        items: [
          {
            key: 'New',
            text: 'New Case',
            iconProps: { iconName: 'Add' },
            onClick: newNetwork,
          },
          {
            key: 'Save',
            text: 'Save Case',
            iconProps: { iconName: 'Save' },
            onClick: saveNetwork,
          },
          {
            key: 'Open',
            text: 'Open Case...',
            iconProps: { iconName: 'FolderOpen' },
            onClick: openNetwork,
          },
        ],
      },
    },
    {
      key: 'Export',
      text: 'Export',
      iconProps: { iconName: 'ShareiOS' },
      subMenuProps: {
        items: [
          {
            key: 'Export',
            text: 'Export Screenshot',
            iconProps: { iconName: 'Share' },
            onClick: () => exportPNG(),
          },
          {
            key: 'ExportCSV',
            text: 'Export CSV',
            iconProps: { iconName: 'Export' },
            onClick: exportCSV,
          }
        ],
      },
    },
  ];

  const farItems = [
    {
      key: 'labels',
      commandBarButtonAs: CommandBarToggle,
    },
    {
      key: 'layout',
      commandBarButtonAs: AutomaticLayoutToggle,
    },
    // {
    //   key: 'run layout',
    //   text: 'Run Automatic Layout',
    //   iconProps: { iconName: 'AutoEnhanceOn' },
    //   onClick: () => runLayout(),
    // },
    // {
    //   key: 'zoomin',
    //   iconOnly: true,
    //   iconProps: { iconName: 'ZoomIn' },
    //   onClick: () => {
    //     cy.current.animate({
    //       'zoom': cy.current.zoom() + 0.5,
    //    });
    //   },
    // },
    // {
    //   key: 'zoomout',
    //   iconOnly: true,
    //   iconProps: { iconName: 'ZoomOut' },
    //   onClick: () => {
    //     cy.current.animate({
    //       'zoom': cy.current.zoom() - 0.5,
    //    });
    //   },
    // },
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
        items={items}
        farItems={farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
    </div>
  );
};

export default TopCommandBar;

