import express from "express";
import {
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getSpecificBlog,
  getDraftBlogs,
  getBlogsByCategory,
} from "../controllers/blog-controller.js";
import isLogin from "../middlewares/auth-middleware.js";
import isAdmin from "../middlewares/admin-middleware.js";
import upload from "../middlewares/imageUpload-middleware.js";

const route = express.Router();

// get all blog posts route
route.get("/get", getBlog);

// get blog post by category
route.get("/category/:slug", getBlogsByCategory);

// get all draft blog post route
route.get("/get/draft", getDraftBlogs);

// get specific blog post
route.get("/get/:id", isLogin, getSpecificBlog);

// create blog post route only accessible for admin
route.post("/create", isLogin, isAdmin, upload.single("image"), createBlog);

// update blog post route only accessible for admin
route.put("/update/:id", isLogin, isAdmin, upload.single("image"), updateBlog);

// delete blog post route only accessible for admin
route.delete("/delete/:id", isLogin, isAdmin, deleteBlog);

export default route;
