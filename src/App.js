import { useState } from "react";

export default function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [addTodo, setAddTodo] = useState(false);
  const [filter, setFilter] = useState("");

  return (
    <>
      <Logo onAddTodo={setAddTodo} onChangeFilter={setFilter} filter={filter} />
      <TodoList
        todoItems={todoItems}
        onAddTodoItems={setTodoItems}
        filter={filter}
      />
      <Modal
        addTodo={addTodo}
        onAddTodo={setAddTodo}
        onAddTodoItems={setTodoItems}
      />
    </>
  );
}

function Logo({ onAddTodo, onChangeFilter, filter }) {
  return (
    <div className="header-container">
      <h1 className="header-title">Doify.</h1>
      <p className="header-description">
        Track what you <span> DO.</span>
      </p>
      <button className="add-todo" onClick={() => onAddTodo(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <select
        className="filter"
        value={filter}
        onChange={(e) => onChangeFilter(e.target.value)}
      >
        <option value="">Select an option</option>
        <option value="all">All</option>
        <option value="unfinished">un-Finished</option>
        <option value="finished">Finished</option>
      </select>
    </div>
  );
}

function TodoList({ todoItems, onAddTodoItems, filter }) {
  let filterItems;
  if (filter === "" || filter === "all") {
    filterItems = todoItems;
  }
  if (filter === "finished") {
    filterItems = todoItems.filter((item) => item.isDone);
  }
  if (filter === "unfinished") {
    filterItems = todoItems.filter((item) => !item.isDone);
  }

  return (
    <div className="todo-container">
      <div className="todo-list">
        {filterItems.map((item, _, items) => (
          <TodoItem
            item={item}
            key={item.id}
            onAddTodoItems={onAddTodoItems}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
}

function TodoItem({ item, onAddTodoItems, id }) {
  function removeItem() {
    onAddTodoItems((items) => items.filter((item) => item.id !== id));
  }
  function changeIsDone() {
    onAddTodoItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      )
    );
  }

  return (
    <div className={` todo-card ${item.isDone ? "done" : ""}`}>
      <input
        className="checkbox"
        type="checkbox"
        checked={item.isDone}
        onChange={() => {
          changeIsDone();
        }}
      />
      <div>
        <h3 className="todo-title">
          {item.title.length < 25
            ? item.title
            : item.title.split("").slice(0, 25).join("") + "..."}
        </h3>
        <p className="todo-description">
          {item.description.length < 80
            ? item.description
            : item.description.split("").slice(0, 80).join("") + "..."}
        </p>
      </div>
      <button className="remove-todo" onClick={removeItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

function Modal({ addTodo, onAddTodo, onAddTodoItems }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function todoItem() {
    if (title === "" && description === "") return;
    const newItem = {
      title,
      description,
      id: crypto.randomUUID(),
      isDone: false,
    };

    onAddTodoItems((items) => [...items, newItem]);
    resetModal();
    setTitle("");
    setDescription("");
    document.getElementById("title").focus();
  }

  function resetModal() {
    setTitle("");
    setDescription("");
    document.getElementById("title").focus();
  }

  return (
    <div
      className={`modal-background ${addTodo ? "" : "hidden"}`}
      onClick={(e) => {
        if (e.target.classList.contains("modal-background")) {
          resetModal();
          onAddTodo(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          resetModal();
          onAddTodo(false);
        }
      }}
    >
      <div className="modal-container">
        <button
          className="button-close-modal"
          onClick={() => {
            resetModal();
            onAddTodo(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="close-modal"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <label htmlFor="title" className="label">
          Title :
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label htmlFor="description" className="label">
          Description :
        </label>

        <textarea
          className="textarea"
          placeholder="write description here..."
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <button className="submit-btn" onClick={todoItem}>
            Add
          </button>
          <button className="reset-submit" onClick={resetModal}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
