import './style.css';
import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddListModal from './components/AddListModal';

// Main app component
function App() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/lists")
      .then(res => res.json())
      .then(data => {
        const fixedData = data.map(list => ({
          ...list,
          id: list._id,
        }));
        setLists(fixedData);
        if (fixedData.length > 0) {
          setActiveListId(fixedData[0].id);
        }
      })
      .catch(err => console.log("Failed to load lists:", err));
  }, []);

  const addNewList = (name) => {
    fetch("http://localhost:4000/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(newList => {
        const fixedList = { ...newList, id: newList._id };
        setLists(prev => [...prev, fixedList]);
        setActiveListId(fixedList.id);
      })
      .catch(err => console.log("Failed to add list:", err));
  };

  const requestDeleteList = (id) => {
    setListToDelete(id);
    setIsDeleteListModalOpen(true);
  };

  const confirmDeleteList = () => {
    if (!listToDelete) return;

    fetch(`http://localhost:4000/lists/${listToDelete}`, {
      method: "DELETE",
    })
      .then(() => {
        const updated = lists.filter(list => list.id !== listToDelete);
        setLists(updated);
        if (listToDelete === activeListId) {
          setActiveListId(updated.length ? updated[0].id : null);
        }
        setIsDeleteListModalOpen(false);
        setListToDelete(null);
      })
      .catch(err => console.log("Failed to delete list:", err));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>My Lists</h2>
        <ul id="list-container">
          {lists.map(list => (
            <li
              key={list.id}
              className={list.id === activeListId ? 'active' : ''}
              onClick={() => setActiveListId(list.id)}
            >
              {list.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  requestDeleteList(list.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button id="new-list-btn" onClick={() => setIsListModalOpen(true)}>
          New List
        </button>
      </aside>

      {activeListId && <TaskList listId={activeListId} />}

      <AddListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSave={addNewList}
      />

      {isDeleteListModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this list?</h3>
            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button className="confirm" onClick={confirmDeleteList}>Yes</button>
              <button className="cancel" onClick={() => setIsDeleteListModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
