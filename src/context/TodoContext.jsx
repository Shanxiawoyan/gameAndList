import React, { useMemo, useReducer, useState } from "react";
import { TodoContext } from "./todoContext";

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const text = action.text.trim();
      if (!text) return state;
      const next = { id: Date.now(), text, status: "pending" };
      return [next, ...state];
    }
    case "DELETE":
      return state.filter((t) => t.id !== action.id);

    case "TOGGLE":
      return state.map((t) =>
        t.id === action.id
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t
      );

    case "EDIT":
      return state.map((t) =>
        t.id === action.id ? { ...t, text: action.text } : t
      );

    default:
      return state;
  }
}

const initialTodos = []; 

export function TodoProvider({ children }) {

  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  const [input, setInput] = useState("");

  const value = useMemo(
    () => ({
      todos,
      input,
      setInput,
      dispatch,
      add: (text)   => dispatch({ type: "ADD", text }),
      remove: (id)  => dispatch({ type: "DELETE", id }),
      toggle: (id)  => dispatch({ type: "TOGGLE", id }),
      edit: (id, text) => dispatch({ type: "EDIT", id, text }),
    }),
    [todos, input]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
