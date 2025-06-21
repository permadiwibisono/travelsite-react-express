import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Facebook,
  Twitter,
  Google,
  Instagram,
  House,
  Envelope,
  Telephone,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-center text-lg-start text-light">
      <Container className="text-center text-md-start mt-5 ">
        <section className="d-flex justify-content-between align-items-center p-4 mb-0 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>
              <h6>Connect with us on social media:</h6>
            </span>
          </div>

          <div>
            <Link
              as={Link}
              to="https://www.facebook.com"
              className="me-4 text-reset"
            >
              <Facebook color="white" />
            </Link>
            <Link as={Link} to="https://www.x.com" className="me-4 text-reset">
              <Twitter color="white" />
            </Link>
            <Link
              as={Link}
              to="https://www.google.com"
              className="me-4 text-reset"
            >
              <Google color="white" />
            </Link>
            <Link
              as={Link}
              to="https://www.instagram.com"
              className="me-4 text-reset"
            >
              <Instagram color="white" />
            </Link>
          </div>
        </section>
        <Row className="mt-5 mb-5">
          <Col md="3" lg="4" xl="3" className="mx-auto mb-4 ">
            <h6 className="text-uppercase fw-bold mb-4">MATA ELANG</h6>
            <p>
              Mata Elang is your trusted partner in creating unforgettable
              travel experiences, connecting you to the beauty of the world.
            </p>
          </Col>

          <Col md="2" lg="2" xl="2" className="mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Quick Links</h6>
            <p>
              <Link as={Link} to="/about-us" className="text-reset">
                About Us
              </Link>
            </p>
            <p>
              <Link as={Link} to="/contact" className="text-reset">
                Contact Us
              </Link>
            </p>
            <p>
              <Link as={Link} to="/destinations" className="text-reset">
                Destinations
              </Link>
            </p>
            <p>
              <Link as={Link} to="/blog" className="text-reset">
                Travel Blog
              </Link>
            </p>
          </Col>

          <Col md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
            <p>
              <House color="white" className="me-3" />
              Jakarta, Indonesia
            </p>
            <p>
              <Envelope color="white" className="me-3" />
              support@mataelang.com
            </p>
            <p>
              <Telephone color="white" className="me-3" />
              +62 81234567890
            </p>
          </Col>

          <Col md="3" lg="3" xl="4" className="mx-auto mb-md-0 mb-4">
            <div className="widget">
              <h6 className="text-uppercase fw-bold mb-4">Our Newsletter</h6>
              <p className="mb-4">
                Subscribe to our newsletter to get the latest travel tips and
                exclusive deals delivered to your inbox.
              </p>
              <form action="#">
                <div className="row gy-4">
                  <div className="col-12">
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        id="email-newsletter-addon"
                      >
                        <Envelope size={16} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email-newsletter"
                        value=""
                        placeholder="Email Address"
                        aria-label="email-newsletter"
                        aria-describedby="email-newsletter-addon"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        type="submit"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="text-center p-4 border-top">
        © 2024 Copyright:
        <Link as={Link} to="/" className="text-reset fw-bold ms-2">
          Mata Elang
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
