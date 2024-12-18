import React from "react";

const Hero = () => {
  return (
    <section className="hero py-5 text-white text-center" style={{ backgroundColor: "#4CAF50" }}>
      <div className="container">
        <h1 className="display-4 mb-3">Selamat Datang di Toko Kami</h1>
        <p className="lead mb-4">
          Temukan berbagai produk menarik dan kategori terbaik untuk kebutuhan Anda.
        </p>
        <a href="#popular-products" className="btn btn-light btn-lg">
          Jelajahi Sekarang
        </a>
      </div>
    </section>
  );
};

export default Hero;
