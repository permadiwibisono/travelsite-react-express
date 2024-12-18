import React from "react";
import { FaTruck, FaDollarSign, FaHeadset } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaTruck size={40} />,
      title: "Pengiriman Cepat",
      description: "Dapatkan barang Anda dalam waktu singkat.",
    },
    {
      icon: <FaDollarSign size={40} />,
      title: "Harga Terjangkau",
      description: "Kami menawarkan harga terbaik untuk Anda.",
    },
    {
      icon: <FaHeadset size={40} />,
      title: "Dukungan Pelanggan",
      description: "Layanan pelanggan 24/7 untuk kebutuhan Anda.",
    },
  ];

  return (
    <section className="features py-5 bg-light">
      <div className="container">
        <div className="row text-center">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="feature-item">
                <div className="mb-3">{feature.icon}</div>
                <h5 className="mb-2">{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
