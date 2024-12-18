import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, Breadcrumb, Modal } from 'react-bootstrap';
import Header from "../../Components/User/Header";
import Footer from "../../Components/User/Footer";
import api from '../../api'; 

const Cart = () => {
  const [address, setAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [products, setProducts] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/users/me');
        setUserAddress(userResponse.data.address);
        setAddress(userResponse.data.address || '');

        const cartResponse = await api.get('/cart');
        setProducts(cartResponse.data.items);
        const total = cartResponse.data.items.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        setTotalOrder(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await api.post('/order/checkout', { address });
      if (response.status === 201) {
        setPaymentUrl(response.data.paymentUrl);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // Close the modal
      setShowPaymentModal(false);
      
      // Navigate to order success page
      navigate('/order/success');
    } catch (error) {
      console.error('Error handling payment:', error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>Kembali</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row className="mt-3">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Keranjang</Card.Title>
                <Form>
                  <Form.Group controlId="formAddress">
                    <Form.Label className="mt-3">Alamat Pengiriman</Form.Label>
                    <Form.Control
                      as="select"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    >
                      <option value={userAddress}>Gunakan Alamat Terdaftar: {userAddress}</option>
                      <option value="">Masukkan Alamat Baru</option>
                    </Form.Control>
                    {address === '' && (
                      <Form.Control
                        type="text"
                        className="mt-2"
                        placeholder="Tambahkan Alamat Baru"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    )}
                  </Form.Group>
                </Form>
                <Card className="mt-4">
                  <Card.Body>
                    <Card.Title>Produk</Card.Title>
                    <ListGroup variant="flush">
                      {products.map(product => (
                        <ListGroup.Item key={product.product._id}>
                          <Row>
                            <Col md={2}>
                              <img src={product.product.image} className="img-fluid" alt={product.product.name} />
                            </Col>
                            <Col md={6}>{product.product.productName}</Col>
                            <Col md={2}>Rp {product.product.price.toLocaleString()}</Col>
                            <Col md={2}>x {product.quantity}</Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Ringkasan Pembelian</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Total Pesanan</Col>
                      <Col>Rp {totalOrder.toLocaleString()}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total Bayar</Col>
                      <Col>Rp {totalOrder.toLocaleString()}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                <Button variant="primary" className="w-100 mt-3" onClick={handleCheckout}>
                  Lanjutkan Pembayaran
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Payment Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Proses Pembayaran</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe 
              src={paymentUrl} 
              width="100%" 
              height="600px" 
              frameBorder="0"
              title="Payment Gateway"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Batalkan
            </Button>
            <Button variant="primary" onClick={handlePaymentComplete}>
              Selesaikan Pembayaran
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;