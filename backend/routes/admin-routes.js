import express from "express";
import isLogin from "../middlewares/auth-middleware.js";
import isAdmin from "../middlewares/admin-middleware.js";
const route = express.Router();

// admin dashboard route
route.get("/dashboard", isLogin, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `welcome to dashboard ${req.userInfo.username}`,
    user: req.userInfo,
  });
});

export default route;
