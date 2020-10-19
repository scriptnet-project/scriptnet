import { createActions, handleActions } from 'redux-actions';

export const modes = {
  DEFAULT: 'DEFAULT',
  CREATE_EDGES: 'CREATE_EDGES',
  ASSIGN_ATTRIBUTES: 'ASSIGN_ATTRIBUTES',
  VIEW_DETAILS: 'VIEW_DETAILS',
  CONFIGURE: 'CONFIGURE',
};

const initialState = modes.DEFAULT;


/*
 * action types
 */
const SET_MODE = 'SET_MODE'

export function setMode(mode) {
  return { type: SET_MODE, mode: modes[mode] }
}

const actionCreators = {
  setMode,
}

const actionTypes = {
  SET_MODE,
}

export default function reducer(state = initialState, action) {
  console.log('reducer', state, action);
  switch (action.type) {
    case 'SET_MODE':
      console.log('yooo', state);
      return action.mode;
    default:
      return state
  }
}

export { actionCreators, actionTypes };
