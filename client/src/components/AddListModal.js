import { useState } from 'react';

// Modal for creating a new list
function AddListModal({ isOpen, onSave, onClose }) {
  const [listName, setListName] = useState('');

  const handleSave = () => {
    if (listName.trim()) {
      onSave(listName);
      setListName(''); // Clear input after saving
      onClose();       // Close the modal
    }
  };

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New List</h3>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="List Name"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddListModal;
