import React, { useState } from "react";
import "./todo.css";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, toggleTodo, editTodo } from "../store/store.js";

function TodoItem({ item }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);

  const save = () => {
    const t = draft.trim();
    if (t) dispatch(editTodo(item.id, t));
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
  const items = useSelector((state) => state.items);
  const [input, setInput] = useState("");

  const pending = items.filter((t) => t.status === "pending");
  const completed = items.filter((t) => t.status === "completed");

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addTodo(input)); 
    setInput("");
  };

  return (
    <div className="todo-page">
      <h1>Todolist</h1>

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
            {pending.map((item) => <TodoItem key={item.id} item={item} />)}
          </ul>
        </section>

        <section className="col">
          <h2>Completed Tasks</h2>
          <ul className="list">
            {completed.map((item) => <TodoItem key={item.id} item={item} />)}
          </ul>
        </section>
      </div>
    </div>
  );
}
