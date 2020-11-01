import { createActions, handleActions } from 'redux-actions';
import { actionCreators as modeActions } from './mode';

const actionCreators = createActions({
  SET_SELECTED: (id, type = 'node') => ({ id, type }),
  CLEAR_SELECTED: undefined, // noop
  TOGGLE_SHOW_LABELS: undefined,
  TOGGLE_AUTOMATIC_LAYOUT: undefined,
});

const initialState = {
  selected: null,
  showLabels: true,
  automaticLayout: true,
};

const reducer = handleActions({
  [actionCreators.setSelected]: (state, action) => ({
    ...state,
    selected: {
      ...action.payload,
    },
  }),
  [actionCreators.clearSelected]: (state) => ({
    ...state,
    selected: initialState.selected,
  }),
  [actionCreators.toggleShowLabels]: (state) => ({
    ...state,
    showLabels: !state.showLabels,
  }),
  [actionCreators.toggleAutomaticLayout]: (state) => ({
    ...state,
    automaticLayout: !state.automaticLayout,
  }),
  [modeActions.setMode]: (state) => ({
    ...state,
    selected: initialState.selected,
  }),
  [modeActions.resetMode]: (state) => ({
    ...initialState,
    automaticLayout: state.automaticLayout,
    showLabels: state.showLabels,
  }),
}, initialState);

export { actionCreators };

export default reducer;
