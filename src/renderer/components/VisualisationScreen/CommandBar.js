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
  const [, cyActions] = useCytoscape();

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
      key: 'Search',
      placeholder: 'Search...',
      underlined: true,
      commandBarButtonAs: SearchBox,
    },
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

