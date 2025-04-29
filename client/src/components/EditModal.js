import { useState, useEffect } from 'react';
import '../style.css';


function EditModal({
  isOpen,
  onClose,
  taskValue,
  taskDesc,
  taskDueDate,
  onSave,
  existingFilePath,
  onReplaceFile,
  onDeleteFile
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    setTitle(taskValue || '');
    setDescription(taskDesc || '');
    setDueDate(taskDueDate || '');
    setNewFile(null);
  }, [taskValue, taskDesc, taskDueDate]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, description, dueDate, newFile);
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

        {/* קובץ קיים */}
        {existingFilePath && !newFile && (
          <div className="file-actions">
            <p>
              <a
                href={`http://localhost:4000/uploads/${existingFilePath}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="download-link"
              >
                Download existing file
              </a>
            </p>
            <button className="btn delete-btn" onClick={onDeleteFile}>Delete File</button>
          </div>
        )}

        {/* העלאת קובץ חדש */}
        <div className="upload-section">
          <label htmlFor="editFileInput" className="upload-label">
            Upload New File
          </label>
          <input
            id="editFileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              setNewFile(file);
              onReplaceFile(file);
            }}
          />
          {newFile && <p>{newFile.name}</p>}
        </div>

        <div className="modal-actions">
          <button className="btn save-btn" onClick={handleSave}>Save</button>
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
