
//create your first component
import { useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([
    "Make the bed",
    "Walk the dog",
    "Pay taxes",
    "Go on vacation",
  ]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const v = inputValue.trim();
      if (!v) return;
      setTodos((prev) => [...prev, v]);
      setInputValue("");
    }
  };

  const removeTodo = (idx) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
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

          {todos.map((todo, idx) => (
            <li key={idx}>
              {todo}
              <i
                className="fa-solid fa-xmark delete-icon"
                onClick={() => removeTodo(idx)}
                role="button"
                aria-label={`Delete ${todo}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && removeTodo(idx)}
              />
            </li>
          ))}
        </ul>

        <div>
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </div>
      </div>
    </>
  );
};



export default Home;

