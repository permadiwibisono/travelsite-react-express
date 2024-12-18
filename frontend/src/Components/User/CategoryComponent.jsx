import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryComponent = ({ categories }) => {
  return (
    <Container className="py-3 py-md-5 py-xl-8 pb-xxl-0 bsb-section-pt-xxl-1 category-container">
      <Row className="justify-content-center category-box border-0">
        <Col xs={12}>
          <Row className="align-items-center justify-content-between">
            <Col>
              <h5>Kategori</h5>
            </Col>
          </Row>
          <Row className="g-3 justify-content-center">
            {categories.map((category) => (
              <Col xs={12} sm={6} md={4} lg={2} key={category.id_category} className="d-flex justify-content-center">
                <Card className="h-100 category-card border-0">
                  <Link to={`/products/${category.id_category}`} className="text-decoration-none text-dark">
                    <Card.Body className="d-flex flex-column align-items-center">
                      <div className="display-6 category-icon">
                        {category.icon || "💊"} {/* Placeholder icon */}
                      </div>
                      <Card.Title className="mt-3 category-name">
                        {category.name_category}
                      </Card.Title>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryComponent;
