import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import api from '../../api';
import HeaderDashboard from '../../Components/Admin/HeaderDashboard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Tambahkan state untuk kategori
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    id_category: '', // Ganti categoryName dengan id_category
    image: null,
    desc: '',
    price: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Ambil kategori saat komponen dimuat
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data.category);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setNewProduct({
      productName: '',
      id_category: '',
      image: null,
      desc: '',
      price: 0,
    });
  };

  const handleShowModal = (product) => {
    if (product) {
      setSelectedProduct(product);
      setNewProduct({ 
        ...product,
        // Pastikan menggunakan id_category
        id_category: product.id_category || ''
      });
    } else {
      setNewProduct({
        productName: '',
        id_category: '',
        image: null,
        desc: '',
        price: 0,
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setNewProduct({ ...newProduct, [name]: e.target.files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', newProduct.productName);
    formData.append('id_category', newProduct.id_category); // Gunakan id_category
    formData.append('image', newProduct.image);
    formData.append('desc', newProduct.desc);
    formData.append('price', newProduct.price);

    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await api.delete(`/products/${product._id}`);
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };
  

  // Fungsi untuk mendapatkan nama kategori berdasarkan id_category
  const getCategoryName = (id_category) => {
    const category = categories.find(cat => cat.id_category === id_category);
    return category ? category.categoryName : 'Uncategorized';
  };

  return (
    <>
      <HeaderDashboard />
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h3>Product List</h3>
          <Button variant="primary" onClick={() => handleShowModal(null)}>
            Tambah Data
          </Button>
        </div>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category Name</th>
              <th>Price (IDR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>
                  {product.image ? (
                    <img src={product.image} alt={product.productName} style={{ maxWidth: '100px' }} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{product.productName}</td>
                <td>{getCategoryName(product.id_category)}</td>
                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleShowModal(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteProduct(product)}
                    className="ms-2"
                  >
                    Delete
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formProductName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="productName"
                    value={newProduct.productName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_category"
                    value={newProduct.id_category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id_category} value={category.id_category}>
                        {category.categoryName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Product Image</Form.Label>
                  {newProduct.image && newProduct.image instanceof File ? (
                    <div>
                      <img src={URL.createObjectURL(newProduct.image)} alt="Product" style={{ maxWidth: '200px' }} />
                    </div>
                  ) : newProduct.image ? (
                    <div>
                      <img src={newProduct.image} alt="Product" style={{ maxWidth: '200px' }} />
                    </div>
                  ) : (
                    <div>No Image</div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formDesc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    name="desc"
                    value={newProduct.desc}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Price (IDR)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit">
              {selectedProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductList;