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

const Items = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    productImage: '',
  });

  // Categories for dropdown (would come from API in production)
  const categories = [
    { _id: "1", name: "Groceries" },
    { _id: "2", name: "Electronics" },
    { _id: "3", name: "Clothing" },
    { _id: "4", name: "Home & Kitchen" }
  ];

  // Dummy data aligned with backend schema
  const dummyProducts = [
    {
      _id: '1',
      name: 'Smartphone',
      description: 'Latest model with high-end features',
      price: 15000,
      category: { _id: "2", name: "Electronics" },
      subCategory: 'Mobile Phones',
      productImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCddtA1b0LgnZ37Nvto8dIhu5vxhIxvxIJw&s',
      createdAt: '2023-10-15T10:30:00Z',
      updatedAt: '2023-10-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt, available in multiple colors',
      price: 499,
      category: { _id: "3", name: "Clothing" },
      subCategory: 'T-Shirts',
      productImage: 'https://gogirgit.com/cdn/shop/products/unisex-men-printed-graphic-golden-yellow-cotton-tshirt-summer-design-gogirgit_1800x.jpg?v=1662573030',
      createdAt: '2023-09-20T14:15:00Z',
      updatedAt: '2023-09-20T14:15:00Z'
    },
    {
      _id: '3',
      name: 'Rice (5kg)',
      description: 'Premium basmati rice',
      price: 350,
      category: { _id: "1", name: "Groceries" },
      subCategory: 'Rice & Grains',
      productImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJlWgt2pYOKkyJyC87ybiAV56fmylG05JZA&s',
      createdAt: '2023-08-12T09:45:00Z',
      updatedAt: '2023-08-12T09:45:00Z'
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const fetchProducts = async () => {
    try {
      // Simulating API call
      setTimeout(() => {
        setProducts(dummyProducts);
        setLoading(false);
      }, 500); // simulate loading time
    } catch (error) {
      alert('Error fetching products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category._id,
        subCategory: product.subCategory,
        productImage: product.productImage,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryObj = categories.find(cat => cat._id === formData.category);
      
      if (selectedProduct) {
        const updated = products.map((p) =>
          p._id === selectedProduct._id ? { 
            ...p,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: categoryObj,
            subCategory: formData.subCategory,
            productImage: formData.productImage,
            updatedAt: new Date().toISOString()
          } : p
        );
        setProducts(updated);
        alert('Product updated successfully');
      } else {
        const newProduct = {
          _id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: categoryObj,
          subCategory: formData.subCategory,
          productImage: formData.productImage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts((prev) => [...prev, newProduct]);
        alert('Product created successfully');
      }
      handleCloseModal();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const updated = products.filter((p) => p._id !== product._id);
        setProducts(updated);
        alert('Product deleted successfully');
      } catch (error) {
        alert('Error deleting product');
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
        {products.map((product) => (
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
            {/* <div className="product-blur"></div> */}
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
                  <span>{product.category.name}</span>
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
        ))}
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
                <div className="form-group">
                  <label htmlFor="category">
                    Category*
                  </label>
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
    </div>
  );
};

export default Items;
