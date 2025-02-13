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
import Profile from "./components/Profile";
import BlogPostForm from "./components/BlogPostForm";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "./components/protected & private routes/ProtectedRoutes";
import PrivateRoutes from "./components/protected & private routes/PrivateRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { admin, login, logout } from "./store/authSlice";
import BlogPostTable from "./components/BlogPostTable";

function App() {
  const { isLoggedIn, isAdmin } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem("token");
    let isAdminTrue = localStorage.getItem("admin");
    // console.log(isAdminTrue);
    // console.log(token);

    if (token && isAdminTrue) {
      dispatch(admin());
      dispatch(login());
    } else if (token && !isAdminTrue) {
      dispatch(login());
    } else if (!token) {
      dispatch(logout());
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
              <Route path="create-blog" element={<BlogPostForm />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
