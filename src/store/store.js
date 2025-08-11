import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.map(d => ({
    id: d.id,
    text: d.title,
    status: d.completed ? "completed" : "pending",
  }));
});

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    addTodo: (state, action) => {
      const text = String(action.payload).trim();
      if (!text) return;
      state.items.unshift({ id: Date.now(), text, status: "pending" });
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      const id = action.payload;
      state.items = state.items.map(t =>
        t.id === id ? { ...t, status: t.status === "pending" ? "completed" : "pending" } : t
      );
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      state.items = state.items.map(t => (t.id === id ? { ...t, text } : t));
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message ?? "Unknown error";
      });
  },
});

export const { addTodo, deleteTodo, toggleTodo, editTodo, clearError } = todosSlice.actions;

export const store = configureStore({
  reducer: todosSlice.reducer, 
});


export const selectTodos  = (state) => state.items;
export const selectStatus = (state) => state.status;
export const selectError  = (state) => state.error;
