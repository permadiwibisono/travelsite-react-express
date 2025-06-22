import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import path from 'path';
import * as storage from "../utils/storage.js";

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

const cleanup = async (req) => {
  if (!req.files?.length) return Promise.resolve();
  const keys = req.files.map(item => item.path);
  console.log("START clean up temp files");
  await storage.deleteObjects(keys);
  console.log("DONE clean up temp files");
}

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
    let fileError = false;
    let images = [];
    if (req.files?.length > 0) {
      try {
        images = await storage.putObjects(req.files, "assets", "products");
        console.log('Uploaded images:', images); // Debug log
      } catch (error) {
        console.error('Error processing files:', error);
        fileError = true;
      }
    }

    if (fileError) throw new Error("Error processing uploaded files");

    const newProduct = new Product({
      productName,
      id_category,
      images: images,
      desc,
      price: parseFloat(price),
    });

    const saved = await newProduct.save();
    await saved.populate('id_category', 'categoryName');
    await cleanup(req);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: saved
    });
  } catch (error) {
    console.error('Error saving product:', error);
    await cleanup(req);
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
    if (removeImages) {
      const removes = typeof removeImages === "string"? JSON.parse(removeImages): removeImages;
      const payload = removes.map(img => {
        const fileUrl = img.replace(/^https?:\/\/[^/]+/, '');
        return fileUrl.substring(fileUrl.indexOf('/')); // Remove leading slash
      });

      const keys = payload.map(imagePath => path.join(process.cwd(), imagePath.replace('/', '')));
      await storage.deleteObjects(keys);

      product.images = product.images.filter(img => !payload.includes(img));
      console.log('Images after removal:', product.images); // Debug log
    }

    // Add new images
    let fileError = false;
    if (req.files && req.files.length > 0) {
      // Proses multiple images
      let images = [];
      try {
        images = await storage.putObjects(req.files, "assets", "products");
        console.log('Uploaded images:', images); // Debug log
      } catch (error) {
        console.error('Error processing files:', error);
        fileError = true;
      }
      product.images = [...product.images, ...images];
    }

    if (fileError) throw new Error("Error processing uploaded files");

    // Update other fields
    if (productName) product.productName = productName;
    if (id_category) product.id_category = id_category;
    if (desc !== undefined) product.desc = desc;
    if (price) product.price = parseFloat(price);

    const updatedProduct = await product.save();
    await updatedProduct.populate('id_category', 'categoryName');
    await cleanup(req);
    res.status(200).json({ 
      success: true,
      message: "Product updated successfully",
      product: updatedProduct 
    });
  } catch (error) {
    console.error(error.message);
    // Hapus file yang baru diupload jika terjadi error
    await cleanup(req);
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
      const keys = product.images.map(imagePath => path.join(process.cwd(), imagePath.replace('/', '')));
      await storage.deleteObjects(keys);
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


    const category = await Category.findOne({ $or: [ {_id: id_category }, { id_category: id_category }] });

    if (!category) {
      return res.status(200).json({
        success: true,
        message: 'No products found for this category',
        products: [],
        count: 0
      });
    }

    console.log('Found category:', category); // Debug log

    // Find products by category with proper population
    const products = await Product.find({ 
      id_category: category._id,
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
