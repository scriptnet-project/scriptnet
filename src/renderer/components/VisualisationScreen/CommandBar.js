import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ChoiceGroup,
  Stack,
  SearchBox,
  TextField,
  FontIcon,
  CommandBar,
  CommandBarButton,
} from '@fluentui/react';
import useCytoscape from '../../hooks/useCytoscape';
import './CommandBar.scss';

const TopCommandBar = ({
}) => {
  const [cy,,, cyActions] = useCytoscape();

  const items = [
    {
      key: 'New',
      text: 'New Case',
      iconProps: { iconName: 'Add' },
      onClick: () => console.log('Open'),
    },
    {
      key: 'Save',
      text: 'Save Case',
      iconProps: { iconName: 'Save' },
      onClick: cyActions.saveNetwork,
    },
    {
      key: 'Open',
      text: 'Open Case...',
      iconProps: { iconName: 'FolderOpen' },
      onClick: cyActions.openNetwork,
    }
  ];

  const farItems = [
    {
      key: 'layout',
      text: 'Automatically Position',
      iconProps: { iconName: 'AutoEnhanceOn' },
      onClick: () => cyActions.runLayout(),
    },
    {
      key: 'zoomin',
      iconOnly: true,
      iconProps: { iconName: 'ZoomIn' },
      onClick: () => {
        cy.current.animate({
          'zoom': cy.current.zoom() + 0.5,
       });
      },
    },
    {
      key: 'zoomout',
      iconOnly: true,
      iconProps: { iconName: 'ZoomOut' },
      onClick: () => {
        cy.current.animate({
          'zoom': cy.current.zoom() - 0.5,
       });
      },
    },
    {
      key: 'fit',
      iconOnly: true,
      iconProps: { iconName: 'ZoomToFit' },
      onClick: () => cy.current.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 500
      }),
    },
    // {
    //   key: 'Search',
    //   placeholder: 'Search...',
    //   underlined: true,
    //   commandBarButtonAs: SearchBox,
    // },
    {
      key: 'Export',
      text: 'Export Screenshot',
      iconProps: { iconName: 'Share' },
      onClick: () => console.log('Export'),
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

