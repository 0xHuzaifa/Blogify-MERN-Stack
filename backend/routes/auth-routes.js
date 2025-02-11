import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth-controller.js";
import { userProfile } from "../controllers/user-controller.js";
import isLogin from "../middlewares/auth-middleware.js";

const route = express.Router();

// registration route
route.post("/register", registerController);

// login route
route.post("/login", loginController);

// user profile
route.get("/profile", isLogin, userProfile);

export default route;
