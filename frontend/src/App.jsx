import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetail from "./components/PostDetail";
import Navbar from "./components/Navbar";
import Profile from "./components/dashboard/Profile";
import BlogCreateForm from "./components/dashboard/BlogCreateForm";
import BlogPostTable from "./components/dashboard/BlogPostTable";
import BlogUpdateForm from "./components/dashboard/BlogUpdateForm";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "./components/protected & private routes/ProtectedRoutes";
import PrivateRoutes from "./components/protected & private routes/PrivateRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { admin, login, logout } from "./store/authSlice";
import { jwtDecode } from "jwt-decode";
import CategoryList from "./components/dashboard/category/CategoryList";
import CategoryAdd from "./components/dashboard/category/CategoryAdd";
import CategoryUpdate from "./components/dashboard/category/CategoryUpdate";
import DraftBlogs from "./components/dashboard/DraftBlogs";

function App() {
  const { isLoggedIn, isAdmin } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem("token");
    // let isAdminTrue = localStorage.getItem("admin");
    if (token) {
      const role = jwtDecode(token);
      if (role.role === "admin") {
        dispatch(admin());
        dispatch(login());
      } else if (role.role === "user") {
        dispatch(login());
      } else {
        localStorage.removeItem("token");
        dispatch(logout());
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFoundPage />} />
        {!isLoggedIn && (
          <>
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Register />} />
          </>
        )}

        {/* <Route path="login" element={<Login />} />
        <Route path="registration" element={<Register />} /> */}

        <Route element={<ProtectedRoutes />}>
          <Route
            path="login"
            element={
              isAdmin ? <Navigate to={"/dashboard"} /> : <Navigate to={"/"} />
            }
          />
          <Route
            path="registration"
            element={
              isAdmin ? <Navigate to={"/dashboard"} /> : <Navigate to={"/"} />
            }
          />
          <Route path="blogs/:id" element={<PostDetail />} />
          <Route element={<PrivateRoutes />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="blogs-list" element={<BlogPostTable />} />
              <Route path="draft-list" element={<DraftBlogs />} />
              <Route path="create-blog" element={<BlogCreateForm />} />
              <Route path="update-blog/:id" element={<BlogUpdateForm />} />
              <Route path="category-list" element={<CategoryList />} />
              <Route path="category-add" element={<CategoryAdd />} />
              <Route path="category-update/:id" element={<CategoryUpdate />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
