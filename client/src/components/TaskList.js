import { useState, useEffect } from 'react';
import EditModal from './EditModal';

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function TaskList({ listId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedFilePath, setEditedFilePath] = useState('');
  const [editedFile, setEditedFile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (!listId) return;
    fetch(`http://localhost:4000/tasks/${listId}`)
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(task => ({ ...task, id: task._id }));
        setTasks(normalized);
      })
      .catch(err => console.log("Failed to load tasks", err));
  }, [listId]);

  const addTask = () => {
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", dueDate);
    formData.append("listId", listId);
    if (file) {
      formData.append("file", file);
    }

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(addedTask => {
        setTasks(prev => [...prev, { ...addedTask, id: addedTask._id }]);
        setTitle('');
        setDescription('');
        setDueDate(getTodayDate());
        setFile(null);
        setSelectedFileName('');
      })
      .catch(err => console.log("Failed to add task", err));
  };

  const requestDeleteTask = (task) => {
    if (task.status === 'Done') return;
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    fetch(`http://localhost:4000/tasks/${taskToDelete.id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
      })
      .catch(err => {
        console.log('Failed to delete task:', err);
        alert('Failed to delete task.');
      });
  };

  const advanceStatus = (task) => {
    if (task.status === 'Done') return;

    const next = {
      'To Do': 'In Work',
      'In Work': 'Done',
      'Done': 'Done',
    }[task.status];

    fetch(`http://localhost:4000/tasks/${task.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(updatedTask => {
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, status: updatedTask.status } : t
        ));
      })
      .catch(err => {
        console.log("Status update failed:", err);
        alert("Failed to update status.");
      });
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.title);
    setEditedDescription(task.description || '');
    setEditedDueDate(task.date || '');
    setEditedFilePath(task.filePath || '');
    setEditedFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteFile = () => {
    fetch(`http://localhost:4000/tasks/${editingTaskId}/file`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete file');
        setEditedFilePath('');
        alert("File deleted");
      })
      .catch(err => {
        console.error('Error deleting file:', err);
        alert('Failed to delete file.');
      });
  };

  const saveEditedTask = (newTitle, newDesc, newDueDate, newFile) => {
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", newDesc);
    formData.append("date", newDueDate);
    if (newFile) {
      formData.append("file", newFile);
    }

    fetch(`http://localhost:4000/tasks/${editingTaskId}`, {
      method: 'PUT',
      body: formData,
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(task =>
          task.id === editingTaskId ? { ...updated, id: updated._id } : task
        ));
        setIsModalOpen(false);
      })
      .catch(err => {
        console.log('Failed to update task:', err);
        alert('Failed to update task.');
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
                {task.filePath && (
                  <div>
                    <a
                      href={`http://localhost:4000/uploads/${task.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download file
                    </a>
                  </div>
                )}
              </div>
              {status !== 'Done' && (
                <>
                  <button onClick={() => advanceStatus(task)}>Advance</button>
                  <button onClick={() => openEditModal(task)}>Edit</button>
                  <button onClick={() => requestDeleteTask(task)}>Delete</button>
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

        {/* Custom file upload button */}
        <label
          htmlFor="fileInput"
          style={{
            cursor: 'pointer',
            backgroundColor: '#eee',
            padding: '8px 12px',
            borderRadius: '5px',
            display: 'inline-block',
            marginBottom: '8px'
          }}
        >
          Upload File
        </label>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            setFile(e.target.files[0]);
            setSelectedFileName(e.target.files[0]?.name || '');
          }}
        />
        {selectedFileName && <p style={{ fontSize: '0.9rem' }}>{selectedFileName}</p>}

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
        existingFilePath={editedFilePath}
        onReplaceFile={(file) => setEditedFile(file)}
        onDeleteFile={handleDeleteFile}
      />

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button className="confirm" onClick={confirmDeleteTask}>Yes</button>
              <button className="cancel" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
