import Product from "../models/productModel.js";
import fs from 'fs';
import path from 'path';

// Get all products
export const getProducts = async (req, res) => {
  try {
    let products = await Product.find().populate('id_category', 'categoryName');
    
    const productsWithImageUrls = products.map(product => ({
      ...product._doc,
      images: product.images?.map(imagePath => 
        imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null
      ).filter(Boolean) || []
    }));
    
    res.status(200).json({ 
      success: true,
      products: productsWithImageUrls 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

// Post a new product
export const postProducts = async (req, res) => {
  const { productName, id_category, desc, price } = req.body;

  try {
    // Validasi input
    if (!productName || !id_category || !price) {
      return res.status(400).json({
        success: false,
        message: "Product name, category, and price are required"
      });
    }

    // Proses multiple images
    const imagePaths = req.files ? req.files.map(file => `/${file.path}`) : [];
    
    const newProduct = new Product({
      productName,
      id_category,
      images: imagePaths,
      desc,
      price: parseFloat(price),
    });

    const saved = await newProduct.save();
    await saved.populate('id_category', 'categoryName');
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: saved
    });
  } catch (error) {
    console.error('Error saving product:', error);
    
    // Hapus file yang sudah diupload jika terjadi error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a product by ID
export const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id).populate('id_category', 'categoryName');

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product Not Found" 
      });
    }

    // Convert image paths to full URLs
    const productWithImageUrls = {
      ...product._doc,
      images: product.images?.map(imagePath => 
        imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null
      ).filter(Boolean) || []
    };

    res.status(200).json({ 
      success: true,
      product: productWithImageUrls 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, id_category, desc, price, removeImages } = req.body;

  try {
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found"
      });
    }

    // Handle image removal
    if (removeImages && Array.isArray(removeImages)) {
      removeImages.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath.replace('/', ''));
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
      
      product.images = product.images.filter(img => !removeImages.includes(img));
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/${file.path}`);
      product.images = [...product.images, ...newImagePaths];
    }

    // Update other fields
    if (productName) product.productName = productName;
    if (id_category) product.id_category = id_category;
    if (desc !== undefined) product.desc = desc;
    if (price) product.price = parseFloat(price);

    const updatedProduct = await product.save();
    await updatedProduct.populate('id_category', 'categoryName');
    
    res.status(200).json({ 
      success: true,
      message: "Product updated successfully",
      product: updatedProduct 
    });
  } catch (error) {
    console.error(error.message);
    
    // Hapus file yang baru diupload jika terjadi error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found"
      });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath.replace('/', ''));
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product Successfully Deleted"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Get products by category
// Contoh implementasi controller getProductsByCategory
export const getProductsByCategory = async (req, res) => {
  try {
    const { id_category } = req.params;
    
    console.log('Getting products for category:', id_category); // Debug log
    
    // Find products by category with proper population
    const products = await Product.find({ 
      id_category: id_category 
    }).populate('id_category', 'categoryName');
    
    console.log('Found products:', products.length); // Debug log
    
    // Convert image paths to full URLs (same as getProducts)
    const productsWithImageUrls = products.map(product => ({
      ...product._doc,
      images: product.images?.map(imagePath => 
        imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null
      ).filter(Boolean) || []
    }));
    
    res.status(200).json({
      success: true,
      message: products.length > 0 ? 'Products found successfully' : 'No products found for this category',
      products: productsWithImageUrls,
      count: productsWithImageUrls.length
    });
    
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
