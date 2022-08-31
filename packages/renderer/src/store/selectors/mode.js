import { get } from 'lodash';

export const getMode = state =>
  get(state, 'mode.mode', 'DEFAULT');

export const getModeOptions = state =>
  get(state, 'mode.options', {});
