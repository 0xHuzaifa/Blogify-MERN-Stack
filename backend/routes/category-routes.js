import express from "express";
import {
  getCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category-controller.js";
import isLogin from "../middlewares/auth-middleware.js";
import isAdmin from "../middlewares/admin-middleware.js";

const route = express.Router();

// get all categories route
route.get("/get", getCategory);

// create category route only accessible for admin
route.post("/create", isLogin, isAdmin, createCategory);

// get specific category
route.get("/get/:id", getSingleCategory);

// update category route only accessible for admin
route.put("/update/:id", isLogin, isAdmin, updateCategory);

// delete category route only accessible for admin
route.delete("/delete/:id", isLogin, isAdmin, deleteCategory);

export default route;
