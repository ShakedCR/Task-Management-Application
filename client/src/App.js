import './style.css';
import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddListModal from './components/AddListModal';

function App() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // 🔁 טוען רשימות מהשרת כשנטען הדף
  useEffect(() => {
    fetch("http://localhost:4000/lists")
      .then(res => res.json())
      .then(data => {
        const fixedData = data.map(list => ({
          ...list,
          id: list._id
        }));
        setLists(fixedData);
        if (fixedData.length > 0) {
          setActiveListId(fixedData[0].id);
        }
      })
      .catch(err => console.error("Failed to load lists:", err));
  }, []);

  // ➕ יצירת רשימה חדשה בשרת
  const addNewList = (name) => {
    fetch("http://localhost:4000/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(newList => {
        const fixedList = { ...newList, id: newList._id };
        setLists((prev) => [...prev, fixedList]);
        setActiveListId(fixedList.id);
      })
      .catch(err => console.error("Failed to add list:", err));
  };

  // 🗑️ מחיקת רשימה מהשרת
  const deleteList = (id) => {
    fetch(`http://localhost:4000/lists/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        const updated = lists.filter((list) => list.id !== id);
        setLists(updated);
        if (id === activeListId) {
          setActiveListId(updated.length ? updated[0].id : null);
        }
      })
      .catch(err => console.error("Failed to delete list:", err));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>My Lists</h2>
        <ul id="list-container">
          {lists.map((list) => (
            <li
              key={list.id}
              className={list.id === activeListId ? 'active' : ''}
              onClick={() => setActiveListId(list.id)}
            >
              {list.name}
              <button onClick={(e) => {
                e.stopPropagation();
                deleteList(list.id);
              }}>🗑️</button>
            </li>
          ))}
        </ul>
        <button id="new-list-btn" onClick={() => setIsListModalOpen(true)}>
          ➕ New List
        </button>
      </aside>

      {activeListId && <TaskList listId={activeListId} />}

      <AddListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSave={addNewList}
      />
    </div>
  );
}

export default App;
