import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    id_category: {
      type: String,
      unique: true,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add this method to generate a unique id_category
CategorySchema.pre('save', async function(next) {
  if (!this.id_category) {
    // Generate a unique id_category if not provided
    this.id_category = new mongoose.Types.ObjectId().toString();
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
