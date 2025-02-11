import React, { useEffect, useState } from "react";
import img1 from "../assets/img1.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function BlogPostCard() {
  const [posts, setPosts] = useState();
  const backendLink = useSelector((state) => state.prodReducer.link);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendLink}/api/blog/get`);
        const resResult = JSON.stringify(res.data.posts);
        // console.log("response", JSON.stringify(res.data.posts));
        setPosts(resResult);
        console.log("posts", posts);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className="max-w-5xl rounded-lg p-5">
        <div className="bg-[#EAFAEA] text-[#6E8E59] flex flex-col sm:flex-row overflow-hidden">
          <img
            src={img1}
            className="aspect-16/9 rounded object-cover"
            alt="title"
          />
          <div className="flex flex-col justify-evenly p-3 sm:p-5 md:px-7">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Blog Post One
            </h2>
            <hr className="max-w-[250px] my-2 " />
            <p className="my-3 line-clamp-3">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
              voluptatibus nam eius est debitis exercitationem eaque impedit.
              Eveniet officiis a perspiciatis possimus enim nemo cumque ducimus
              laborum similique, architecto aliquid est ipsam?
            </p>

            <div className="flex flex-wrap justify-between items-center font-medium text-[14px]">
              <div className="flex space-x-4 sm:space-x-3 self-center font-medium text-">
                <h3>Huzaifa Ahmed</h3>
                <p>1/29/25</p>
              </div>
              <button className="transition duration-300 ease-in-out px-3 py-0.5 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]">
                <Link to={`/blogs/:{id}`}>Read More</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
