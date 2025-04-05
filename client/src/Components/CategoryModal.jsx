import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTag, faFileAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Modal.css';

const CategoryModal = ({ isOpen, onClose, onSave, initialData = null, fromItemForm = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-icon" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{initialData ? 'Edit Category' : 'Add New Category'}</h2>
        {fromItemForm && (
          <div className="modal-info-box">
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>
              Create a category to organize your items. You can use this category for multiple items.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faTag} /> Category Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics, Clothing, Food"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              <FontAwesomeIcon icon={faFileAlt} /> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description for this category"
              rows="3"
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {initialData ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal; 