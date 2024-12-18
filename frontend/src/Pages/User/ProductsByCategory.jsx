import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Header from "../../Components/User/Header";
import Footer from "../../Components/User/Footer";

const ProductsByCategory = () => {
  const { id_category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch products based on category or all products
  const fetchProducts = async () => {
    try {
      let response;
      if (id_category) {
        // Fetch products for specific category
        response = await api.get(`/products/category/${id_category}`);
      } else {
        // Fetch all products
        response = await api.get('/products');
      }
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products", error);
      setProducts([]);
    }
  };

  // Fetch category information
  const fetchCategoryInfo = async () => {
    try {
      if (id_category) {
        const response = await api.get(`/category/${id_category}`);
        setCategory(response.data.category);
      } else {
        setCategory(null);
      }
    } catch (error) {
      console.error("Error fetching category info", error);
      setCategory(null);
    }
  };

  // Fetch all categories for the sidebar
  const fetchAllCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data.category);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoryInfo();
    fetchAllCategories();
  }, [id_category]);

  // Navigate to product detail page
  const handleProductClick = (product) => {
    navigate(`/products/detail-product/${product._id}`);
  };

  // Handle category selection
  const handleCategoryClick = (selectedCategoryId) => {
    // If the selected category is already the current category, navigate to all products
    if (id_category === selectedCategoryId) {
      navigate('/products');
    } else {
      navigate(`/products/${selectedCategoryId}`);
    }
  };

  // Format IDR currency
  const formatIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  return (
    <>
      <Header />
      <Container fluid className="product-container">
        <Row>
          {/* Products Section - Left Side */}
          <Col md={9}>
            {/* Category Header */}
            <Row className="category-header justify-content-center mb-3">
              <Col>
                <h5>
                  {category 
                    ? `Products in Category: ` 
                    : 'All Products'}
                </h5>
              </Col>
            </Row>

            {/* Product Cards */}
            {products.length === 0 ? (
              <Alert variant="info" className="text-center">
                No products available in this category.
              </Alert>
            ) : (
              <Row className="g-3 justify-content-start">
                {products.map((item, index) => (
                  <Col
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="d-flex justify-content-start"
                  >
                    <Card
                      className="product-card h-100 border-0 shadow"
                      onClick={() => handleProductClick(item)}
                    >
                      <Card.Img
                        variant="top"
                        src={item.image}
                        className="product-card-img"
                      />
                      <Card.Body>
                        <Card.Title className="product-name">{item.productName}</Card.Title>
                        <Card.Text className="product-price">{formatIDR(item.price)}</Card.Text>
                        <Button variant="outline-primary" className="w-100 mt-auto">
                          Detail
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>

          {/* Categories Section - Right Side */}
          <Col md={3} className="bg-light py-4">
            <h5 className="mb-4">Categories</h5>
            <Row className="g-3">
              {categories.map((category) => (
                <Col
                  xs={12}
                  key={category.id_category}
                  className="d-flex justify-content-start"
                >
                  <Card 
                    className="w-100 category-card border-0 mb-2"
                    style={{ 
                      backgroundColor: id_category === category.id_category ? '#e9ecef' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCategoryClick(category.id_category)}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <div className="me-3 display-6 category-icon">
                        {category.icon || " "} {/* Placeholder icon */}
                      </div>
                      <Card.Title className="category-name mb-0">
                        {category.categoryName}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ProductsByCategory;