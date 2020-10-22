import React from 'react';
import {
  CompoundButton,
  Stack,
  SearchBox,
  VerticalDivider
} from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as modeActions, modes } from '../../store/mode';
import { useBoolean } from '@uifabric/react-hooks';
import './ControlBar.scss';
import AddPersonForm from '../Forms/AddPersonForm';
import AddLocationForm from '../Forms/AddLocationForm';
import AddOrganisationForm from '../Forms/AddOrganisationForm';
import AddResourceForm from '../Forms/AddResourceForm';

const ControlBar = ({

}) => {
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();
  const setMode = (mode) => dispatch(modeActions.setMode(mode));
  const setSelectedNode = (node) => dispatch(selectedNodeActions.setSelectedNode(node));

  const [hidePersonDialog, { toggle: toggleHidePersonDialog }] = useBoolean(true);
  const [hideLocationDialog, { toggle: toggleHideLocationDialog }] = useBoolean(true);
  const [hideResourceDialog, { toggle: toggleHideResourceDialog }] = useBoolean(true);
  const [hideOrganisationDialog, { toggle: toggleHideOrganisationDialog }] = useBoolean(true);


  return (
    <div className="ControlBar">
      <AddPersonForm hideDialog={hidePersonDialog} toggleHideDialog={toggleHidePersonDialog}/>
      <AddLocationForm hideDialog={hideLocationDialog} toggleHideDialog={toggleHideLocationDialog}/>
      <AddResourceForm hideDialog={hideResourceDialog} toggleHideDialog={toggleHideResourceDialog}/>
      <AddOrganisationForm hideDialog={hideOrganisationDialog} toggleHideDialog={toggleHideOrganisationDialog}/>
      <Stack horizontal tokens={{ childrenGap: 10 }} verticalFill className="primary-stack">
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Add a new node to this case"
            text="Add Nodes"
            onMenuClick={() => {
              setMode(modes.DEFAULT);
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
                  key: 'location',
                  value: 'location',
                  text: 'Location',
                  iconProps: { iconName: 'MapPin' },
                  onClick: toggleHideLocationDialog
                },
                {
                  key: 'resource',
                  value: 'resource',
                  text: 'Resource',
                  iconProps: { iconName: 'SharepointAppIcon16' },
                  onClick: toggleHideResourceDialog
                },
                {
                  key: 'organisation',
                  value: 'organisation',
                  text: 'Organisation',
                  iconProps: { iconName: 'Work' },
                  onClick: toggleHideOrganisationDialog
                },
              ],
            }}
            iconProps={{ iconName: "addFriend"}}
            verticalFill
            primary={mode === modes.DEFAULT && !selectedNode}
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
              setMode(modes.CREATE_EDGES);
            }}
            primary={mode === modes.CREATE_EDGES}
          />
        </Stack.Item>
        <VerticalDivider />
        <Stack.Item grow verticalFill className="primary-action-button">
          <CompoundButton className="primary-action-button__button"
            secondaryText="Assign actors to certain scenes within the case"
            text="Assign Scenes"
            iconProps={{ iconName: "Fingerprint"}}
            verticalFill
            onClick={() => setMode(modes.ASSIGN_ATTRIBUTES)}
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
            onClick={() => setMode(modes.CONFIGURE)}
            primary={mode === modes.CONFIGURE}
          />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ControlBar;

