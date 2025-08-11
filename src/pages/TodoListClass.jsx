import React from "react";
import "./todo.css";


class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, draft: props.item.text };
  }

  startEdit = () =>
    this.setState({ editing: true, draft: this.props.item.text });

  onChange = (e) => this.setState({ draft: e.target.value });

  save = () => {
    const t = this.state.draft.trim();
    if (t) this.props.onEdit(this.props.item.id, t);
    this.setState({ editing: false });
  };

  cancel = () =>
    this.setState({ editing: false, draft: this.props.item.text });

  render() {
    const { item, onDelete, onToggle } = this.props;
    const { editing, draft } = this.state;

    return (
      <li className="todo-row">
        {editing ? (
          <input
            className="todo-input"
            value={draft}
            onChange={this.onChange}
            autoFocus
          />
        ) : (
          <span className="todo-text">{item.text}</span>
        )}

        <div className="btns">
          {editing ? (
            <>
              <button className="btn save" onClick={this.save} title="Save">
                ✔
              </button>
              <button className="btn cancel" onClick={this.cancel} title="Cancel">
                ✖
              </button>
            </>
          ) : (
            <button className="btn edit" onClick={this.startEdit} title="Edit">
              ✎
            </button>
          )}

          <button
            className="btn delete"
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            🗑
          </button>

          <button
            className="btn move"
            onClick={() => onToggle(item.id)}
            title={item.status === "pending" ? "Mark Completed" : "Move Back"}
          >
            {item.status === "pending" ? "➡" : "⬅"}
          </button>
        </div>
      </li>
    );
  }
}


export default class TodoListClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      items: [],
    };
  }

  handleAdd = (e) => {
    e.preventDefault();
    const text = this.state.input.trim();
    if (!text) return;
    const next = { id: Date.now(), text, status: "pending" };
    this.setState((s) => ({ items: [next, ...s.items], input: "" }));
  };

  handleDelete = (id) => {
    this.setState((s) => ({ items: s.items.filter((t) => t.id !== id) }));
  };

  handleToggleStatus = (id) => {
    this.setState((s) => ({
      items: s.items.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t
      ),
    }));
  };

  handleEdit = (id, newText) => {
    this.setState((s) => ({
      items: s.items.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    }));
  };

  renderList(status) {
    return (
      <ul className="list">
        {this.state.items
          .filter((t) => t.status === status)
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onDelete={this.handleDelete}
              onToggle={this.handleToggleStatus}
              onEdit={this.handleEdit}
            />
          ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="todo-page">
        <h1>Todolist</h1>

        <form className="add-bar" onSubmit={this.handleAdd}>
          <input
            placeholder="Add a task..."
            value={this.state.input}
            onChange={(e) => this.setState({ input: e.target.value })}
          />
          <button type="submit">submit</button>
        </form>

        <div className="cols">
          <section className="col">
            <h2>Pending Tasks</h2>
            {this.renderList("pending")}
          </section>

          <section className="col">
            <h2>Completed Tasks</h2>
            {this.renderList("completed")}
          </section>
        </div>
      </div>
    );
  }
}
