import { Link } from "react-router-dom";

export default function Home() {
  const card = {
    padding: "18px 28px",
    border: "1px solid black",
    borderRadius: 12,
    textDecoration: "none",
    color: "inherit",
    fontWeight: 600,
  };

  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <h1>Choose a Demo</h1>
      <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
        <Link style={card} to="/tic-tac-toe">Tic Tac Toe Game</Link>
        <Link style={card} to="/todolist">Todolist</Link>
      </div>
    </div>
  );
}
