import React from 'react';
import {
  CompoundButton,
  Stack,
  SearchBox
} from '@fluentui/react';
import { useBoolean } from '@uifabric/react-hooks';
import './ControlBar.scss';
import { AddPersonForm, AddPlaceForm } from './AddEntityForms';

const ControlBar = () => {
  const [hidePersonDialog, { toggle: toggleHidePersonDialog }] = useBoolean(true);
  const [hidePlaceDialog, { toggle: toggleHidePlaceDialog }] = useBoolean(true);

  return (
    <div className="ControlBar">
      <AddPersonForm hideDialog={hidePersonDialog} toggleHideDialog={toggleHidePersonDialog}/>
      <AddPlaceForm hideDialog={hidePlaceDialog} toggleHideDialog={toggleHidePlaceDialog}/>
      <Stack horizontal tokens={{ childrenGap: 10 }} verticalFill className="primary-stack">
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Add a new actor to this case"
            text="Add Actors"
            tokens={{
              maxWidth: 25,
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
        />
        </Stack.Item>
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Add a new relationship between actors"
            onClick={toggleHidePersonDialog}
            text="Add Relationships"
            iconProps={{ iconName: "GitGraph"}}
            verticalFill
          />
        </Stack.Item>
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Assign actors to certain actions within the case"
            onClick={toggleHidePersonDialog}
            text="Assign Actions"
            iconProps={{ iconName: "Fingerprint"}}
            verticalFill
          />
        </Stack.Item>
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Change the way the network is displayed"
            onClick={toggleHidePersonDialog}
            text="Change Visualisation"
            iconProps={{ iconName: "PictureFill"}}
            verticalFill
          />
        </Stack.Item>
      </Stack>
      {/* <Stack>
        <SearchBox placeholder="Find in network..." onSearch={newValue => console.log('value is ' + newValue)} />
      </Stack> */}
    </div>
  );
};

export default ControlBar;

