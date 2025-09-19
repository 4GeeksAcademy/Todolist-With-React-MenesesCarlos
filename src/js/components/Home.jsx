import { useEffect, useState, useCallback } from "react";

const API = "https://playground.4geeks.com/todo";
const USERNAME = "carlos";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);


  const ensureUser = useCallback(async () => {
    const res = await fetch(`${API}/users/${USERNAME}`);
    if (res.status === 404) {
      const create = await fetch(`${API}/users/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      if (!create.ok) throw new Error("No se pudo crear el usuario");
      return;
    }
    if (!res.ok) throw new Error(`GET usuario falló: ${res.status}`);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      await ensureUser();
      const resp = await fetch(`${API}/users/${USERNAME}`);
      if (!resp.ok) throw new Error(`GET tareas falló: ${resp.status}`);
      const data = await resp.json();
      const list = Array.isArray(data) ? data : (data?.todos ?? []);
      setTodos(list);
    } catch (e) {
      console.error(e);
    }
  }, [ensureUser]);


  const addTodo = async (label) => {
    const text = label.trim();
    if (!text) return;

    const task = { label: text, done: false };

    let resp = await fetch(`${API}/todos/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (resp.status === 404) {
      await ensureUser();
      resp = await fetch(`${API}/todos/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    }

    if (!resp.ok) {
      console.error(await resp.text());
      return;
    }
    await fetchTodos();
  };


  const deleteTodo = async (todoId) => {
    if (!todoId) return;
    let resp = await fetch(`${API}/todos/${todoId}`, { method: "DELETE" });

    if (resp.status === 404) {
      await ensureUser();
      await fetchTodos();
      return;
    }

    if (!resp.ok) {
      console.error(await resp.text());
      return;
    }
    await fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const v = inputValue.trim();
      if (!v) return;
      setInputValue("");
      await addTodo(v);
    }
  };

  return (
    <>
      <h1>Todos</h1>

      <div className="container">
        <ul>
          <li>
            <input
              type="text"
              placeholder="What do you need to do?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </li>

          {todos.map((todo, idx) => {
            const id = todo.id ?? todo._id ?? idx;
            const label =
              typeof todo === "string" ? todo : (todo.label ?? "Untitled");
            return (
              <li key={id}>
                {label}
                <i
                  className="fa-solid fa-xmark delete-icon"
                  onClick={() => deleteTodo(todo.id ?? todo._id)}
                  role="button"
                  aria-label={`Delete ${label}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && deleteTodo(todo.id ?? todo._id)}
                  title="Eliminar"
                />
              </li>
            );
          })}
        </ul>

        <div className="footer">
          <span>
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
    </>
  );
};

export default Home;
