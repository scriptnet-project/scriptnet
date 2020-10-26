import { createActions, handleActions } from 'redux-actions';
import { actionCreators as modeActions } from './mode';

const actionCreators = createActions({
  SET_SELECTED: (id, type = 'node') => ({ id, type }),
  CLEAR_SELECTED: undefined, // noop
  TOGGLE_SHOW_LABELS: undefined,
});

const intialState = {
  selected: null,
  showLabels: true,
};

const reducer = handleActions({
  [actionCreators.setSelected]: (state, action) => ({
    ...state,
    selected: {
      ...action.payload,
    },
  }),
  [actionCreators.clearSelected]: () => ({
    ...intialState,
  }),
  [actionCreators.toggleShowLabels]: (state) => ({
    ...state,
    showLabels: !state.showLabels,
  }),
  [modeActions.setMode]: () => ({
    ...intialState,
  }),
  [modeActions.resetMode]: () => ({
    ...intialState,
  }),
}, intialState);

export { actionCreators };

export default reducer;
