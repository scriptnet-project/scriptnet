import { createActions, handleActions } from 'redux-actions';

export const modes = {
  DEFAULT: 'DEFAULT',
  CREATE_EDGES: 'CREATE_EDGES',
  ASSIGN_ATTRIBUTES: 'ASSIGN_ATTRIBUTES',
  VIEW_DETAILS: 'VIEW_DETAILS',
  CONFIGURE: 'CONFIGURE',
};

const modeDefaultOptions = {
  [modes.ASSIGN_ATTRIBUTES]: {
    highlightScene: 'preparation',
  },
  [modes.CREATE_EDGES]: {
    createEdgeType: 'personal',
  },
};

const actionCreators = createActions({
  SET_MODE: (mode, options = {}) => {
    const defaultOptions = modeDefaultOptions[mode] || {};

    return {
      mode,
      options: {
        ...defaultOptions,
        ...options,
      },
    };
  },
  SET_OPTION: (option, value) => ({ option, value }),
  SET_OPTIONS: (options = {}) => options,
  RESET_MODE: undefined, // noop
});

const intialState = {
  mode: modes.DEFAULT,
  options: {},
};

const reducer = handleActions({
  [actionCreators.setMode]: (state, action) => ({
    ...action.payload,
  }),
  [actionCreators.setOptions]: (state, action) => ({
    ...state,
    options: action.payload,
  }),
  [actionCreators.setOption]: (state, action) => ({
    ...state,
    options: {
      ...state.options,
      [action.payload.option]: action.payload.value,
    },
  }),
  [actionCreators.resetMode]: () => ({
    ...intialState,
  }),
}, intialState);

export { actionCreators };

export default reducer;
