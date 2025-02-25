import Category from "../models/Category.js";
import BlogPost from "../models/BlogPost.js";
import mongoose from "mongoose";

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (name === "" || slug === "") {
      return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
    }

    const newCategory = new Category({
      name,
      slug: slug.toLowerCase(),
    });

    if (!newCategory) {
      return res.status(400).json({
        success: false,
        message: "Unable to create new category",
      });
    }

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const allCategories = await Category.find().sort({ name: 1 });

    if (!allCategories || allCategories.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Categories not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories Found Successfully",
      total: allCategories.length,
      categories: allCategories,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category Found Successfully",
      category: category,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Category not exist",
      });
    }

    const { name, slug } = req.body;

    if (name === "" || slug === "") {
      return res.status(400).json({
        success: false,
        message: "Category can not be empty",
      });
    }

    console.log("name", name);
    console.log("slug", slug);
    console.log("slug", slug.toLowerCase().trim());

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        slug: slug.toLowerCase(),
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);
    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

const getUncategorized = async () => {
  let unCategorized = await Category.findOne({ name: "UnCategorized" });
  if (!unCategorized) {
    unCategorized = new Category({
      name: "UnCategorized",
      slug: "un-categorized",
    });
    await unCategorized.save();
  }
  return unCategorized;
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Category not exist",
      });
    }

    const unCategorized = await getUncategorized();
    await BlogPost.updateMany(
      { category: category._id },
      { category: unCategorized._id }
    );

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Category Deleted Successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export {
  getCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
