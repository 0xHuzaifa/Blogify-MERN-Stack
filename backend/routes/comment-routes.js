import express from "express";
import {
  createBlogComment,
  getCommentsByPost,
  updateBlogComment,
  deleteBlogComment,
} from "../controllers/comments-controller.js";
import isLogin from "../middlewares/auth-middleware.js";

const route = express.Router();

route.get("/get/:postId", isLogin, getCommentsByPost);

route.post("/create", isLogin, createBlogComment);

route.patch("/update", isLogin, updateBlogComment);

route.delete("/delete", isLogin, deleteBlogComment);

export default route;
