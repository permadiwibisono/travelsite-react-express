import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body className="text-center">
              <h1>Pembayaran Berhasil!</h1>
              <p>Terima kasih atas pembelian Anda.</p>
              {order && (
                <div>
                  <p><strong>ID Pesanan:</strong> {order._id}</p>
                  <p><strong>Total Pembayaran:</strong> Rp {order.total.toLocaleString()}</p>
                </div>
              )}
              <p>Silakan cek email Anda untuk detail lebih lanjut.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;
