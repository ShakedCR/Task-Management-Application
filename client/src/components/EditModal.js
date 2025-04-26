import { useState, useEffect } from 'react';

// Modal for editing a task
function EditModal({ isOpen, onClose, taskValue, taskDesc, taskDueDate, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    setTitle(taskValue || '');
    setDescription(taskDesc || '');
    setDueDate(taskDueDate || '');
  }, [taskValue, taskDesc, taskDueDate]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, description, dueDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Task</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
