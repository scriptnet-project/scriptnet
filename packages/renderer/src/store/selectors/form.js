import { get } from 'lodash';

export const getActiveForm = state =>
  get(state, 'form.activeForm');
