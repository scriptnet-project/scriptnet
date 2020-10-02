import React from 'react';
import {
  CompoundButton,
  Stack,
  SearchBox,
  VerticalDivider
} from '@fluentui/react';
import { modes } from 'Components/VisualisationScreen/config';
import { useBoolean } from '@uifabric/react-hooks';
import './ControlBar.scss';
import { AddPersonForm, AddPlaceForm } from './AddEntityForms';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { isPanelOpen } from './PanelManager';

const ControlBar = ({
  onSetMode,
  mode,
}) => {
  const [hidePersonDialog, { toggle: toggleHidePersonDialog }] = useBoolean(true);
  const [hidePlaceDialog, { toggle: toggleHidePlaceDialog }] = useBoolean(true);
  const [selectedNode, setSelectedNode] = useSessionStorage('selectedNode', null);

  return (
    <div className="ControlBar">
      <AddPersonForm hideDialog={hidePersonDialog} toggleHideDialog={toggleHidePersonDialog}/>
      <AddPlaceForm hideDialog={hidePlaceDialog} toggleHideDialog={toggleHidePlaceDialog}/>
      <Stack horizontal tokens={{ childrenGap: 10 }} verticalFill className="primary-stack">
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Add a new actor to this case"
            text="Add Actors"
            onMenuClick={() => {
              onSetMode(modes.DEFAULT);
            }}
            menuProps={{
              items: [
                {
                  key: 'person',
                  value: 'person',
                  text: 'Person',
                  iconProps: { iconName: 'AddFriend' },
                  onClick: toggleHidePersonDialog
                },
                {
                  key: 'place',
                  value: 'place',
                  text: 'Place',
                  iconProps: { iconName: 'MapPin' },
                  onClick: toggleHidePlaceDialog
                },
                {
                  key: 'resource',
                  value: 'resource',
                  text: 'Resource',
                  iconProps: { iconName: 'SharepointAppIcon16' },
                },
                {
                  key: 'business',
                  value: 'business',
                  text: 'Business',
                  iconProps: { iconName: 'Work' },
                },
              ],
            }}
            iconProps={{ iconName: "addFriend"}}
            verticalFill
            primary={mode === modes.DEFAULT}
        />
        </Stack.Item>
        <VerticalDivider />
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Add a new relationship between actors"
            text="Add Relationships"
            iconProps={{ iconName: "GitGraph"}}
            verticalFill
            onClick={() => {
              onSetMode(modes.CREATE_EDGES);
            }}
            primary={mode === modes.CREATE_EDGES}
          />
        </Stack.Item>
        <VerticalDivider />
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Assign actors to certain actions within the case"
            text="Assign Actions"
            iconProps={{ iconName: "Fingerprint"}}
            verticalFill
            onClick={() => onSetMode(modes.ASSIGN_ATTRIBUTES)}
            primary={mode === modes.ASSIGN_ATTRIBUTES}
          />
        </Stack.Item>
        <VerticalDivider />
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Change the way the network is displayed"
            text="Change Visualisation"
            iconProps={{ iconName: "PictureFill"}}
            verticalFill
            onClick={() => onSetMode(modes.CONFIGURE)}
            primary={mode === modes.CONFIGURE}
          />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ControlBar;

