import { get } from 'lodash';

export const getSelected = state =>
  get(state, 'visualisation.selected');

export const getSelectedNode = state => {
  const id = get(getSelected(state), 'id');
  const type = get(getSelected(state), 'type');
  if (id && type !== 'node') { return null; }
  return id;
};

export const getSelectedEdge = state => {
  const id = get(getSelected(state), 'id');
  const type = get(getSelected(state), 'type');
  if (id && type !== 'edge') { return null; }
  return id;
};
