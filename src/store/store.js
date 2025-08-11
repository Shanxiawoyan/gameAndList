
import { createStore, applyMiddleware, compose } from "redux";


export const ADD_TODO    = "todos/ADD_TODO";
export const DELETE_TODO = "todos/DELETE_TODO";
export const TOGGLE_TODO = "todos/TOGGLE_TODO";
export const EDIT_TODO   = "todos/EDIT_TODO";


export const addTodo    = (text)        => ({ type: ADD_TODO,    payload: { text } });
export const deleteTodo = (id)          => ({ type: DELETE_TODO, payload: { id } });
export const toggleTodo = (id)          => ({ type: TOGGLE_TODO, payload: { id } });
export const editTodo   = (id, text)    => ({ type: EDIT_TODO,   payload: { id, text } });


const initialState = { items: [] };

function todosReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const text = action.payload.text.trim();
      if (!text) return state;
      const next = { id: Date.now(), text, status: "pending" };
      return { ...state, items: [next, ...state.items] };
    }
    case DELETE_TODO: {
      const { id } = action.payload;
      return { ...state, items: state.items.filter((t) => t.id !== id) };
    }
    case TOGGLE_TODO: {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((t) =>
          t.id === id
            ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
            : t
        ),
      };
    }
    case EDIT_TODO: {
      const { id, text } = action.payload;
      return {
        ...state,
        items: state.items.map((t) => (t.id === id ? { ...t, text } : t)),
      };
    }
    default:
      return state;
  }
}

const addTitleTimestampMiddleware = () => (next) => (action) => {
  if (action?.type === ADD_TODO && typeof action.payload?.text === "string") {
    const iso = new Date().toISOString().slice(0, 10);
    const original = action.payload.text;
    action = {
      ...action,
      payload: { ...action.payload, text: `Added at ${iso}: ${original}` },
    };
  }
  return next(action);
};


const timingEnhancer = (createStoreFn) => (reducer, preloaded, enhancer) => {
  const store = createStoreFn(reducer, preloaded, enhancer);
  const rawDispatch = store.dispatch;

  return {
    ...store,
    dispatch(action) {
      const t0 = performance.now();
      const result = rawDispatch(action);
      const t1 = performance.now();
 
      console.log(`[timing] ${action.type} reduced in ${(t1 - t0).toFixed(2)}ms`);
      return result;
    },
  };
};


const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  todosReducer,
  composeEnhancers(
    timingEnhancer,                     
    applyMiddleware(addTitleTimestampMiddleware) 
  )
);
