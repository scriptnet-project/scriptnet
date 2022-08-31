import { get } from 'lodash';

export const getSelected = state =>
  get(state, 'visualisation.selected');

export const getSelectedId = state =>
  get(state, 'visualisation.selected.id');

export const getSelectedType = state =>
  get(state, 'visualisation.selected.type');

export const getSelectedNode = state => {
  const id = getSelectedId(state);
  if (id && getSelectedType(state) !== 'node') { return null; }
  return id;
};

export const getSelectedEdge = state => {
  const id = getSelectedId(state);
  const type = get(getSelected(state), 'type');
  if (id && getSelectedType(state) !== 'edge') { return null; }
  return id;
};

export const getShowLabels = state =>
  get(state, 'visualisation.showLabels');

export const getAutomaticLayout = state =>
  get(state, 'visualisation.automaticLayout');

export const getShowMap = state =>
  get(state, 'visualisation.showMap');
