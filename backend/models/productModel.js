import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true, // Ubah ke true karena nama produk harus ada
      unique: true,
    },
    id_category: {
      type: mongoose.Schema.Types.ObjectId, // Lebih baik menggunakan ObjectId
      ref: 'Category',
      required: true,
    },
    images: [{
      type: String, // Array of image paths
      required: false,
    }],
    desc: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;