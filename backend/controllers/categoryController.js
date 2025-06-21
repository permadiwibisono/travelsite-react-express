import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

// Get All Categories
export const getCategory = async (req, res) => {
  try {
    let category = await Category.find();
    res.status(200).json({ 
      success: true,
      category: category 
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

// Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by _id first, then by id_category
    let category = await Category.findById(id) || 
                  await Category.findOne({ id_category: id });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    res.status(200).json({
      success: true,
      category: category
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

// Get Products by Category ID (Alternative method using aggregation)
export const getProductByCategory = async (req, res) => {
  const { id } = req.params;
  const field = {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
    list_product: { createdAt: 0, updatedAt: 0, __v: 0 },
  };
  
  try {
    let category = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "id_category",
          foreignField: "id_category",
          as: "list_product",
        },
      },
      {
        $match: {
          $or: [
            { id_category: id },
            { _id: new mongoose.Types.ObjectId(id) }
          ]
        },
      },
    ]).project(field);
    
    res.status(200).json({ 
      success: true,
      category: category 
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

// Add Category
export const postCategory = async (req, res) => {
  const { categoryName, icon } = req.body;

  try {
    const existingCategory = await Category.findOne({
      categoryName: categoryName
    });

    if (existingCategory) {
      return res.status(400).json({ 
        success: false,
        message: 'Category with this name already exists' 
      });
    }

    const newCategory = new Category({
      id_category: new mongoose.Types.ObjectId().toString(),
      categoryName,
      icon,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({ 
      success: true,
      message: 'Category created successfully',
      category: savedCategory 
    });
  } catch (error) {
    console.error(error.message);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Duplicate key error' 
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, icon } = req.body;

  try {
    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    category.categoryName = categoryName || category.categoryName;
    category.icon = icon || category.icon;

    const updatedCategory = await category.save();
    res.status(200).json({ 
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory 
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

// Delete Category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Category deleted successfully' 
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