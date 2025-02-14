import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import img2 from "../assets/img2.jpg";
export default function PostDetail() {
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const backendLink = useSelector((state) => state.prodReducer.link);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not logged In!");
        }
        setLoading(true);
        const res = await axios.get(`${backendLink}/api/blog/get/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        // const resResult = JSON.stringify(res.data.posts);
        // console.log("response", JSON.stringify(res.data.posts));
        setBlog(res.data.post);
      } catch (error) {
        console.log("catch error", error);
        navigate("/");
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);
  return (
    <article className="max-w-full bg-[#EAFAEA]">
      <div className="w-full sm:max-w-[550px] md:max-w-[750px] lg:max-w-[970px] xl:max-w-[1170px] mx-auto px-[15px] py-8 sm:py-10 md:py-13 lg:py-18">
        {/* Title */}
        <div className="pb-10">
          <label
            htmlFor="title"
            className="text-base font-semibold text-[#6E8E59]"
          >
            Title
          </label>
          <h1 className="text-xl sm:text-3xl md:text-5xl text-[#780C28] font-bold">
            {blog ? blog.title : ""}
          </h1>
        </div>

        {/* Image */}
        <div className="aspect-3/2 mx-auto">
          {/* 183 / 275 = 0.6655 */}
          <img
            src={blog ? blog.thumbnail.url : ""}
            alt="Blog post main image"
            className="w-full h-[50%] object-cover object-center rounded-lg"
          />
        </div>

        <div>
          <p>{blog ? blog.content : ""}</p>
        </div>
      </div>
    </article>
  );
}
