import React, { useEffect, useState } from "react";
import "./todo.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
  fetchTodos,
  clearError,
  selectTodos,
  selectStatus,
  selectError,
} from "../store/store.js";

function TodoItem({ item }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);

  const save = () => {
    const t = draft.trim();
    if (t) dispatch(editTodo({ id: item.id, text: t }));
    setEditing(false);
  };

  const cancel = () => {
    setDraft(item.text);
    setEditing(false);
  };

  return (
    <li className="todo-row">
      {editing ? (
        <input
          className="todo-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
      ) : (
        <span className="todo-text">{item.text}</span>
      )}

      <div className="btns">
        {editing ? (
          <>
            <button className="btn save" onClick={save} title="Save">✔</button>
            <button className="btn cancel" onClick={cancel} title="Cancel">✖</button>
          </>
        ) : (
          <button className="btn edit" onClick={() => setEditing(true)} title="Edit">✎</button>
        )}
        <button className="btn delete" onClick={() => dispatch(deleteTodo(item.id))} title="Delete">🗑</button>
        <button
          className="btn move"
          onClick={() => dispatch(toggleTodo(item.id))}
          title={item.status === "pending" ? "Mark Completed" : "Move Back"}
        >
          {item.status === "pending" ? "➡" : "⬅"}
        </button>
      </div>
    </li>
  );
}

export default function TodoList() {
  const dispatch = useDispatch();
  const items = useSelector(selectTodos);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  const [input, setInput] = useState("");

  // Load initial data once
  useEffect(() => {
    if (status === "idle") dispatch(fetchTodos());
  }, [status, dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addTodo(input));
    setInput("");
  };

  const pending = items.filter((t) => t.status === "pending");
  const completed = items.filter((t) => t.status === "completed");

  return (
    <div className="todo-page">
      <h1>Todolist</h1>

      {status === "loading" && <p>Loading todos…</p>}
      {status === "failed" && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
          <button
            style={{ marginLeft: 10 }}
            className="btn"
            onClick={() => {
              dispatch(clearError());
              dispatch(fetchTodos());
            }}
          >
            Retry
          </button>
        </div>
      )}

      <form className="add-bar" onSubmit={handleAdd}>
        <input
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>

      <div className="cols">
        <section className="col">
          <h2>Pending Tasks</h2>
          <ul className="list">
            {pending.map((item) => (
              <TodoItem key={item.id} item={item} />
            ))}
          </ul>
        </section>

        <section className="col">
          <h2>Completed Tasks</h2>
          <ul className="list">
            {completed.map((item) => (
              <TodoItem key={item.id} item={item} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
