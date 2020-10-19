import { createActions, handleActions } from 'redux-actions';
import { actionTypes as modeActionTypes } from './mode';

const actionCreators = createActions({
  SET_SELECTED: (id, type = 'node') => ({ id, type }),
  CLEAR_SELECTED: undefined, // noop
});

const intialState = {
  selected: null,
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
  [modeActionTypes.SET_MODE]: () => ({
    ...intialState,
  }),
}, intialState);

export { actionCreators };

export default reducer;
