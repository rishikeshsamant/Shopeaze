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
  faMoneyBillWave
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
    stock: '',
    unit: 'piece',
  });

  // Dummy data for now
  const dummyProducts = [
    {
      _id: '1',
      name: 'Apple',
      description: 'Fresh red apples',
      price: 1.5,
      category: 'Fruits',
      stock: 120,
      unit: 'kg',
    },
    {
      _id: '2',
      name: 'Carrot',
      description: 'Organic carrots',
      price: 0.8,
      category: 'Vegetables',
      stock: 200,
      unit: 'kg',
    },
    {
      _id: '3',
      name: 'Milk',
      description: 'Dairy milk 1L pack',
      price: 2.0,
      category: 'Dairy',
      stock: 80,
      unit: 'litre',
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
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
      setFormData(product);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        unit: 'piece',
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
      if (selectedProduct) {
        const updated = products.map((p) =>
          p._id === selectedProduct._id ? { ...formData, _id: p._id } : p
        );
        setProducts(updated);
        alert('Product updated successfully');
      } else {
        const newProduct = {
          ...formData,
          _id: Date.now().toString(),
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

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td className="description-cell">{product.description}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.unit}</td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleOpenModal(product)}
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(product)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button 
              className="close-icon" 
              onClick={handleCloseModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
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
                <label htmlFor="description">Description</label>
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
                  <label htmlFor="price">
                    <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '8px' }} />
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">
                    <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">
                    <FontAwesomeIcon icon={faBox} style={{ marginRight: '8px' }} />
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="litre">Litre</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProduct ? 'Update Product' : 'Add Product'}
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
