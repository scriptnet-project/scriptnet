import { createActions, handleActions } from 'redux-actions';

const intialState = {
  activeForm: null,
};

export const forms = {
  PERSON: 'PERSON',
  ORGANISATION: 'ORGANISATION',
  RESOURCE: 'RESOURCE',
};

const actionCreators = createActions({
  SET_FORM: (form) => ({ form }),
  RESET_FORM: undefined, // noop
});

const reducer = handleActions({
  [actionCreators.setForm]: (state, action) => ({
    ...state,
    activeForm: action.payload.form,
  }),
  [actionCreators.resetForm]: () => ({
    ...intialState,
  }),
}, intialState);

export { actionCreators };

export default reducer;
