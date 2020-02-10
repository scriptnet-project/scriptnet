import { createActions, handleActions } from 'redux-actions';

const actionCreators = createActions({
  ADD_TODO: [
    todo => ({ todo }), // payload creator
    todo => ({ mode: 'add' }) // meta creator
  ],
});

const intialState = {
  todos: [],
};

const reducer = handleActions({
  [actionCreators.addTodo]: (state, action) => ({
    todos: [ ...state.todos, action.payload.todo ],
  }),
}, intialState);

export { actionCreators };

export default reducer;
