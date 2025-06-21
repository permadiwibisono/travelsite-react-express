import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Alert, Image, Badge } from 'react-bootstrap';
import api from '../../api';
import HeaderDashboard from '../../Components/Admin/HeaderDashboard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    id_category: '',
    images: [],
    desc: '',
    price: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data.category || []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setError('Failed to fetch categories');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedFiles([]);
    setPreviewImages([]);
    setError('');
    setSuccess('');
    setNewProduct({
      productName: '',
      id_category: '',
      images: [],
      desc: '',
      price: 0,
    });
  };

  const handleShowModal = (product) => {
    if (product) {
      setSelectedProduct(product);
      setNewProduct({
        productName: product.productName || '',
        id_category: product.id_category?._id || product.id_category || '',
        images: product.images || [],
        desc: product.desc || '',
        price: product.price || 0,
      });
      setPreviewImages(product.images || []);
    } else {
      setNewProduct({
        productName: '',
        id_category: '',
        images: [],
        desc: '',
        price: 0,
      });
      setPreviewImages([]);
    }
    setSelectedFiles([]);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validasi file
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        setError(`File ${file.name} is not a valid image type`);
        return false;
      }
      
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length !== files.length) {
      return; // Ada file yang tidak valid
    }

    // Batasi maksimal 10 file
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    
    setError('');
  };

  const removePreviewImage = (index, isExisting = false) => {
    if (isExisting) {
      // Remove existing image from product
      const updatedImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({ ...newProduct, images: updatedImages });
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove new selected file
      const existingCount = newProduct.images.length;
      const fileIndex = index - existingCount;
      
      // Revoke object URL to prevent memory leaks
      if (previewImages[index] && previewImages[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewImages[index]);
      }
      
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('productName', newProduct.productName);
    formData.append('id_category', newProduct.id_category);
    formData.append('desc', newProduct.desc);
    formData.append('price', newProduct.price);

    // Append new images
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    // If updating, send info about removed images
    if (selectedProduct && selectedProduct.images) {
      const removedImages = selectedProduct.images.filter(
        img => !newProduct.images.includes(img)
      );
      if (removedImages.length > 0) {
        formData.append('removeImages', JSON.stringify(removedImages));
      }
    }

    try {
      let response;
      if (selectedProduct) {
        response = await api.put(`/products/${selectedProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        setSuccess(selectedProduct ? 'Product updated successfully!' : 'Product created successfully!');
        fetchProducts();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product', error);
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete(`/products/${product._id}`);
      
      if (response.data.success) {
        setSuccess('Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      setError(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    if (typeof category === 'object' && category?.categoryName) {
      return category.categoryName;
    }
    
    const foundCategory = categories.find(cat => 
      cat._id === category || cat.id_category === category
    );
    return foundCategory ? foundCategory.categoryName : 'Uncategorized';
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      previewImages.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  return (
    <>
      <HeaderDashboard />
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h3>Product List</h3>
          <Button variant="primary" onClick={() => handleShowModal(null)} disabled={loading}>
            Add Product
          </Button>
        </div>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Images</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (IDR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No products found</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <Image 
                            src={product.images[0]} 
                            alt={product.productName}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            rounded
                          />
                          {product.images.length > 1 && (
                            <Badge bg="secondary" className="align-self-start">
                              +{product.images.length - 1}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <div className="text-muted">No Images</div>
                      )}
                    </div>
                  </td>
                  <td>{product.productName}</td>
                  <td>{getCategoryName(product.id_category)}</td>
                  <td>
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR' 
                    }).format(product.price)}
                  </td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => handleShowModal(product)}
                      disabled={loading}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="productName"
                    value={newProduct.productName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="id_category"
                    value={newProduct.id_category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id || category.id_category} value={category._id || category.id_category}>
                        {category.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price (IDR) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter description"
                    name="desc"
                    value={newProduct.desc}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Product Images (Max 10 images, 10MB each)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Supported formats: JPEG, JPG, PNG, WebP. Max size: 10MB per image.
                  </Form.Text>
                </Form.Group>

                {previewImages.length > 0 && (
                  <div className="mb-3">
                    <Form.Label>Image Preview:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {previewImages.map((image, index) => (
                        <div key={index} className="position-relative">
                          <Image
                            src={image}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            rounded
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0"
                            style={{ transform: 'translate(50%, -50%)' }}
                            onClick={() => removePreviewImage(index, index < newProduct.images.length)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Add Product')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductList;