import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTag,
  faFileAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import categoryService from '../services/api/categoryService';
import CategoryModal from '../Components/CategoryModal';
import { toast } from 'react-toastify';
import '../styles/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (formData) => {
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      handleCloseModal();
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await categoryService.deleteCategory(category._id);
        toast.success('Category deleted successfully');
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="header">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="no-categories">
            <p>No categories found. Add your first category!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div className="category-card" key={category._id}>
              <div className="category-icon">
                <FontAwesomeIcon icon={faTag} />
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                {category.description && (
                  <p className="category-description">
                    <FontAwesomeIcon icon={faFileAlt} /> {category.description}
                  </p>
                )}
              </div>
              <div className="category-actions">
                <button
                  className="btn-icon edit-btn"
                  onClick={() => handleOpenModal(category)}
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-icon delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category);
                  }}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default Categories; 