import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import api from '../../api';
import HeaderDashboard from '../../Components/Admin/HeaderDashboard';
import { v4 as uuidv4 } from 'uuid'; // Tambahkan import uuid untuk generate id_category

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id_category: '', // Tambahkan id_category
    categoryName: '',
    icon: '🎒', // Default icon
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
    setSelectedCategory(null);
    setNewCategory({
      id_category: '', // Reset id_category
      categoryName: '',
      icon: '🎒', // Reset to default icon when closing modal
    });
  };

  const handleShowModal = (category) => {
    if (category) {
      setSelectedCategory(category);
      setNewCategory({ 
        ...category,
        id_category: category.id_category || uuidv4() // Gunakan id_category yang ada atau generate baru
      });
    } else {
      setNewCategory({
        id_category: uuidv4(), // Generate id_category baru untuk kategori baru
        categoryName: '',
        icon: '🎒', // Default icon for new category
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pastikan id_category selalu ada
      const categoryToSubmit = {
        ...newCategory,
        id_category: newCategory.id_category || uuidv4()
      };

      if (selectedCategory) {
        const response = await api.put(`/category/${selectedCategory._id}`, categoryToSubmit);
        console.log('Category updated:', response.data);
      } else {
        const response = await api.post('/category', categoryToSubmit);
        console.log('New category added:', response.data);
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save category', error);
      // Tambahkan penanganan error yang lebih spesifik
      if (error.response) {
        alert(error.response.data.msg || 'Failed to save category');
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await api.delete(`/category/${categoryId}`);
      console.log('Category deleted:', response.data);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
      if (error.response) {
        alert(error.response.data.msg || 'Failed to delete category');
      }
    }
  };

  return (
    <>
      <HeaderDashboard />
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h3>Category List</h3>
          <Button variant="primary" onClick={() => handleShowModal(null)}>
            Add Category
          </Button>
        </div>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Icon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.categoryName}</td>
                <td>{category.icon}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleShowModal(category)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                name="categoryName"
                value={newCategory.categoryName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formIcon">
              <Form.Label>Icon</Form.Label>
              <Form.Control
                as="select"
                name="icon"
                value={newCategory.icon}
                onChange={handleInputChange}
                required
              >
                {/* Opsi icon tetap sama */}
                <option value="🎒">🎒 Backpack</option>
                <option value="🧳">🧳 Suitcase</option>
                <option value="🏕">🏕 Tent</option>
                <option value="🗺">🗺 Map</option>
                <option value="🧭">🧭 Compass</option>
                <option value="🕶">🕶 Sunglasses</option>
                <option value="📸">📸 Camera</option>
                <option value="🛶">🛶 Canoe</option>
                <option value="🏔">🏔 Mountain</option>
                <option value="🗻">🗻 Snowy Mountain</option>
                <option value="🌍">🌍 Globe</option>
                <option value="🚵‍♂️">🚵‍♂️ Mountain Biker</option>
                <option value="⛺">⛺ Camping</option>
                <option value="🚤">🚤 Boat</option>
                <option value="🚂">🚂 Train</option>
                <option value="✈️">✈️ Airplane</option>
                <option value="🚗">🚗 Car</option>
                <option value="🛵">🛵 Scooter</option>
              </Form.Control>
            </Form.Group>
            {/* Tampilkan id_category untuk referensi */}
            {newCategory.id_category && (
              <Form.Group className="mb-3" controlId="formIdCategory">
                <Form.Control
                  type="hidden"
                  value={newCategory.id_category}
                  readOnly
                />
              </Form.Group>
            )}
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {selectedCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CategoryList;