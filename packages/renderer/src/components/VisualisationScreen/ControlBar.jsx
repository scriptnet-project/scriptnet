import React, { useCallback, useState } from 'react';
import {
  CompoundButton,
  Stack,
  VerticalDivider,
} from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useCytoscape } from '../../hooks/Cytoscape';
import { actionCreators as modeActions, modes } from '../../store/mode';
import Forms from '../Forms/Forms';

import './ControlBar.scss';

const ControlBar = ({

}) => {
  const { id } = useCytoscape();
  const mode = useSelector(state => state.mode);
  const selectedNode = useSelector(state => state.selectedNode);
  const dispatch = useDispatch();
  const setMode = (mode) => dispatch(modeActions.setMode(mode));

  const [form, setForm] = useState(null);

  const setVisualisation = useCallback((event, option) => {
    console.log('changed preset to:', option.key);
    setMode(modes.CONFIGURE);
    dispatch(modeActions.setOption('preset', option.key));
  }, [id]);

  return (
    <div className="ControlBar">
      <Forms
        form={form}
        onClose={() => setForm(null)}
      />
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
                  onClick: () => setForm('person'),
                },
                {
                  key: 'location',
                  value: 'location',
                  text: 'Location',
                  iconProps: { iconName: 'MapPin' },
                  onClick: () => setForm('location'),
                },
                {
                  key: 'resource',
                  value: 'resource',
                  text: 'Resource',
                  iconProps: { iconName: 'SharepointAppIcon16' },
                  onClick: () => setForm('resource'),
                },
                {
                  key: 'organisation',
                  value: 'organisation',
                  text: 'Organisation',
                  iconProps: { iconName: 'Work' },
                  onClick: () => setForm('organisation'),
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
            text="Apply Visualisation"
            iconProps={{ iconName: "PictureFill"}}
            verticalFill
            primary={mode === modes.CONFIGURE}
            menuProps={{
              items: [
                {
                  key: 'scene',
                  text: 'Visualise Scenes',
                  onClick: setVisualisation
                },
                {
                  key: 'relationship-filter',
                  text: 'Filter by Relationships',
                  onClick: setVisualisation
                },
                {
                  key: 'focal',
                  text: 'Focal Individual',
                  onClick: setVisualisation
                },
                {
                  key: 'jurisdiction',
                  text: 'Visualise Jurisdictions',
                  onClick: setVisualisation
                },
                {
                  key: 'geography',
                  value: 'Scenes',
                  text: 'Visualise Geography',
                  onClick: setVisualisation
                },
              ],
            }}
          />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ControlBar;

