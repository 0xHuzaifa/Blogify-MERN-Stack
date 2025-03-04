import dotenv from "dotenv";
import express from "express";
// import bodyParser from "body-parser";
import cors from "cors";
import connectToDB from "./database/db.js";
// const authRoutes = require("./routes/auth-routes.js")
import authRoutes from "./routes/auth-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import blogRoutes from "./routes/blog-routes.js";
import categoryRoutes from "./routes/category-routes.js";
import commentRoutes from "./routes/comment-routes.js";

dotenv.config();

// middlewares
const app = express();
app.use(cors());
app.use(express.json());

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
  });
});
