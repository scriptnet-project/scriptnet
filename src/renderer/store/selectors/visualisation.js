import { get } from 'lodash';

export const getSelected = state =>
  get(state, 'visualisation.selected');
