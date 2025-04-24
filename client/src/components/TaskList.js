import { useState, useEffect } from 'react';
import EditModal from './EditModal';

function TaskList({ listId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');

  useEffect(() => {
    if (!listId) return;

    fetch(`http://localhost:4000/tasks/${listId}`)
      .then(res => res.json())
      .then(data => {
        // מוסיפים id רגיל על בסיס _id
        const normalized = data.map(task => ({ ...task, id: task._id }));
        setTasks(normalized);
      })
      .catch(err => console.error("Failed to load tasks", err));
  }, [listId]);

  const addTask = () => {
    if (!title.trim()) return;

    const newTask = {
      title,
      description,
      date: dueDate,
      listId
    };

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(addedTask => {
        setTasks(prev => [...prev, { ...addedTask, id: addedTask._id }]);
        setTitle('');
        setDescription('');
        setDueDate('');
      })
      .catch(err => console.error("Failed to add task", err));
  };

  const deleteTask = (id, status) => {
    if (status === 'Done') return;

    fetch(`http://localhost:4000/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(err => {
        console.error('Failed to delete task:', err);
        alert('שגיאה במחיקת משימה 😥');
      });
  };

  const advanceStatus = (task) => {
    const next = {
      'To Do': 'In Work',
      'In Work': 'Done',
      'Done': 'Done',
    }[task.status];

    if (task.status === 'Done') return;

    fetch(`http://localhost:4000/tasks/${task.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((updatedTask) => {
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, status: updatedTask.status } : t
        ));
      })
      .catch(err => {
        console.error("Status update failed:", err);
        alert("שגיאה בעדכון סטטוס 😥");
      });
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.title);
    setEditedDescription(task.description || '');
    setEditedDueDate(task.date || '');
    setIsModalOpen(true);
  };

  const saveEditedTask = (newTitle, newDesc, newDueDate) => {
    fetch(`http://localhost:4000/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDesc,
        date: newDueDate,
      }),
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(task =>
          task.id === editingTaskId ? { ...updated, id: updated._id } : task
        ));
        setIsModalOpen(false);
      })
      .catch(err => {
        console.error('Failed to update task:', err);
        alert('שגיאה בעדכון משימה 😥');
      });
  };

  const renderTasksByStatus = (status) => (
    <div>
      <h2 className="section-title">{status}</h2>
      <ul>
        {tasks
          .filter(task => task.status === status)
          .map(task => (
            <li key={task.id} className="task">
              <div className="info">
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>{task.date && `Due: ${task.date}`}</small>
              </div>
              {status !== 'Done' && (
                <>
                  <button onClick={() => advanceStatus(task)}>➡️</button>
                  <button onClick={() => openEditModal(task)}>✏️</button>
                  <button onClick={() => deleteTask(task.id, task.status)}>❌</button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <div className="main">
      <h2 className="section-title">Task List</h2>

      <div className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {renderTasksByStatus('To Do')}
      {renderTasksByStatus('In Work')}
      {renderTasksByStatus('Done')}

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskValue={editedText}
        taskDesc={editedDescription}
        taskDueDate={editedDueDate}
        onSave={saveEditedTask}
      />
    </div>
  );
}

export default TaskList;
