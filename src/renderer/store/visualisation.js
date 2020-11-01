import { createActions, handleActions } from 'redux-actions';
import { actionCreators as modeActions } from './mode';

const actionCreators = createActions({
  SET_SELECTED: (id, type = 'node') => ({ id, type }),
  CLEAR_SELECTED: undefined, // noop
  TOGGLE_SHOW_LABELS: undefined,
  TOGGLE_AUTOMATIC_LAYOUT: undefined,
  AUTOMATIC_LAYOUT_OFF: undefined,
});

const intialState = {
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
  [actionCreators.clearSelected]: () => ({
    ...intialState,
  }),
  [actionCreators.toggleShowLabels]: (state) => ({
    ...state,
    showLabels: !state.showLabels,
  }),
  [actionCreators.toggleAutomaticLayout]: (state) => ({
    ...state,
    automaticLayout: !state.automaticLayout,
  }),
  [actionCreators.automaticLayoutOff]: (state) => ({
    ...state,
    automaticLayout: false,
  }),
  [modeActions.setMode]: (state) => ({
    ...state,
    selected: intialState.selected,
  }),
  [modeActions.resetMode]: () => ({
    ...intialState,
    selected: intialState.selected,
  }),
}, intialState);

export { actionCreators };

export default reducer;
