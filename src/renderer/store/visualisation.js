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
  [actionCreators.SET_SELECTED]: (state, { payload }) => ({
    ...state,
    selected: {
      id: payload.id,
      type: payload.type,
    },
  }),
  [actionCreators.CLEAR_SELECTED]: () => ({
    ...intialState,
  }),
  [modeActionTypes.SET_MODE]: () => ({
    ...intialState,
  }),
}, intialState);

export { actionCreators };

export default reducer;
