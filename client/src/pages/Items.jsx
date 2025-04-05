import { useState, useEffect } from 'react';
import '../styles/Items.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes,
  faSpinner,
  faBox,
  faTag,
  faMoneyBillWave,
  faImage,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import itemService from '../services/api/itemService';
import categoryService from '../services/api/categoryService';
import CategoryModal from '../Components/CategoryModal';
import { toast } from 'react-toastify';

const Items = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    productImage: '',
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error fetching categories');
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category._id || product.category,
        subCategory: product.subCategory || '',
        productImage: product.productImage || '',
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        productImage: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleOpenCategoryModal = () => {
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      toast.success('Category created successfully');
      
      // Refresh categories and update form to select the new category
      await fetchCategories();
      setFormData(prev => ({
        ...prev,
        category: response.data._id
      }));
      
      handleCloseCategoryModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating category');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if a category is selected
    if (!formData.category) {
      toast.error('Please select or create a category');
      return;
    }
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subCategory: formData.subCategory,
        productImage: formData.productImage,
      };
      
      if (selectedProduct) {
        await itemService.updateItem(selectedProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await itemService.createItem(productData);
        toast.success('Product created successfully');
      }
      
      handleCloseModal();
      fetchProducts(); // Refresh the products list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await itemService.deleteItem(product._id);
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the products list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="header">
        <h1>Items</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FontAwesomeIcon icon={faPlus} /> Add Product
        </button>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Add your first product!</p>
          </div>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-card-image">
                {product.productImage ? (
                  <img src={product.productImage} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    <FontAwesomeIcon icon={faImage} />
                  </div>
                )}
              </div>
              <div className="product-card-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <div className="product-price">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  <div className="product-category">
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <span>{product.category?.name || 'Category'}</span>
                    {product.subCategory && (
                      <span className="product-subcategory">{product.subCategory}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="product-card-actions">
                <button
                  className="btn-icon edit-btn"
                  onClick={() => handleOpenModal(product)}
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-icon delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product);
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-icon" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faBox} /> Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">
                  <FontAwesomeIcon icon={faTag} /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group category-form-group">
                  <label htmlFor="category">
                    Category*
                  </label>
                  <div className="category-selection">
                    {categories.length === 0 ? (
                      <button 
                        type="button" 
                        className="create-first-category-btn"
                        onClick={handleOpenCategoryModal}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create Your First Category
                      </button>
                    ) : (
                      <>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          className="add-category-btn"
                          onClick={handleOpenCategoryModal}
                          title="Add new category"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </>
                    )}
                  </div>
                  {categories.length > 0 && !formData.category && (
                    <div className="category-helper-text">
                      Please select a category or create a new one.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="subCategory">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">
                    <FontAwesomeIcon icon={faMoneyBillWave} /> Price (₹)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productImage">
                    <FontAwesomeIcon icon={faImage} /> Product Image URL
                  </label>
                  <input
                    type="text"
                    id="productImage"
                    name="productImage"
                    value={formData.productImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {selectedProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategory}
        initialData={null}
        fromItemForm={true}
      />
    </div>
  );
};

export default Items;
