import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TicTacToe from "./pages/TicTacToe.jsx";
import TodoList from "./pages/TodoList.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tic-tac-toe" element={<TicTacToe />} />
      <Route path="/todolist" element={<TodoList />} />
    </Routes>
  );
}
