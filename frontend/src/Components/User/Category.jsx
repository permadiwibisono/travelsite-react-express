import React from "react";
import { Link } from "react-router-dom";

const Category = ({ categories }) => {
  return (
    <section className="category py-5">
      <div className="container">
        <h2 className="text-center mb-4">Kategori Produk</h2>
        <div className="row">
          {categories.map((category) => (
            <div key={category.id_category} className="col-md-3 mb-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <div className="display-6 mb-3">
                    {category.icon || <span>📦</span>}
                  </div>
                  <h5 className="card-title">{category.name_category}</h5>
                  <Link
                    to={`/products/${category.id_category}`}
                    className="btn btn-primary mt-3"
                  >
                    Lihat Produk
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
