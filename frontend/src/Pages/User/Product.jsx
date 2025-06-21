import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Header from "../../Components/User/Header";
import Footer from "../../Components/User/Footer";
import FloatingCart from "../../Components/User/FloatingCart";
import api from "../../api";

const Product = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(categoryParam || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch all products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        setCategories(response.data.category);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Reset filter if no category is selected
  useEffect(() => {
    if (!categoryFilter) {
      const fetchAllProducts = async () => {
        try {
          const response = await api.get("/products");
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching all products", error);
        }
      };
      fetchAllProducts();
    }
  }, [categoryFilter]);

  // Filter products by category
  const handleCategoryClick = async (categoryName, id_category) => {
    try {
      if (categoryFilter === categoryName) {
        // Reset filter if the same category is clicked again
        setCategoryFilter("");
        const response = await api.get("/products");
        setProducts(response.data.products);
      } else {
        setCategoryFilter(categoryName);
        const response = await api.get(`/products/category/${id_category}`);
        setProducts(response.data.products);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products by category", error);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatIDR = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Function to render product image (first image from array or fallback to single image)
  const renderProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image;
  };

  return (
    <>
      <Header />
      <FloatingCart />
      <Container className="product-container py-4">
        <Row>
          {/* Sidebar Categories */}
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow">
              <Card.Body>
                <Card.Title className="text-center mb-3">Kategori</Card.Title>
                <ul className="list-group list-group-flush">
                  {categories.map((category) => (
                    <li key={category.id_category} className="list-group-item border-0 p-1">
                      <Button
                        variant={categoryFilter === category.categoryName ? "primary" : "outline-primary"}
                        className="w-100 text-start"
                        onClick={() => handleCategoryClick(category.categoryName, category.id_category)}
                      >
                        {category.categoryName}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Form.Control
              type="text"
              className="mt-4"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </Col>

          {/* Main Content */}
          <Col md={9}>
            <Row>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <Col md={4} lg={3} className="mb-4" key={product._id}>
                    <Card className="product-card h-100 border-0 shadow">
                      <Card.Img
                        variant="top"
                        src={renderProductImage(product)}
                        className="product-card-img"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-name text-truncate">
                          {product.productName}
                        </Card.Title>
                        <Card.Text className="product-price">
                          {formatIDR(product.price)}
                        </Card.Text>
                        <Button
                          variant="outline-primary"
                          className="w-100 mt-auto"
                          onClick={() => navigate(`/products/detail-product/${product._id}`)}
                        >
                          Lihat Detail
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <p>Tidak ada produk ditemukan.</p>
                </Col>
              )}
            </Row>

            {filteredProducts.length > pageSize && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={filteredProducts.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Product;