import { createActions, handleActions } from 'redux-actions';
import { actionTypes as modeActionTypes } from './mode';

const initialState = null;


/*
 * action types
 */
const SET_SELECTED_NODE = 'SET_SELECTED_NODE'

export function setSelectedNode(node) {
  return { type: SET_SELECTED_NODE, node}
}

const actionCreators = {
  setSelectedNode,
}

const actionTypes = {
  SET_SELECTED_NODE,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SELECTED_NODE':
      return action.node;
    case modeActionTypes.SET_MODE:
      return initialState
    default:
      return state
  }
}

export { actionCreators, actionTypes };
