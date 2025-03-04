import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  storeComments,
  addComment,
  deleteComment,
  updateComment,
} from "../store/commentSlice";

export default function CommentSection({ comments, blogId }) {
  const initialValue = {
    blogPostId: blogId,
    comment: "",
  };
  const updateValue = {
    commentId: "",
    comment: "",
  };

  const [currentUser, setCurrentUser] = useState();
  const [commentInput, setCommentInput] = useState(initialValue);
  const [commentUpdate, setCommentUpdate] = useState(updateValue);
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newError, setNewError] = useState(null);
  const [commentError, setCommentError] = useState({});

  const backendLink = useSelector((state) => state.prodReducer.link);
  const { commentsData, loading: load } = useSelector(
    (state) => state.commentReducer
  );
  const dispatch = useDispatch();

  // convert words to capitalize
  const capitalizeUserName = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    dispatch(storeComments(comments));
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setCurrentUser(user);
      // console.log(user.username);    // username of the user
    }
  }, [dispatch, comments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setNewError(null);
      const res = await axios.post(
        `${backendLink}/api/comment/create`,
        commentInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        dispatch(addComment(res.data.comment));
        setCommentInput(initialValue);
      }
      toast.success(res.data.message);
    } catch (error) {
      setNewError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();

    try {
      const { payload } = await dispatch(updateComment(commentUpdate));

      if (payload?.success) {
        setIsCommentUpdate(false);
        setCommentUpdate(updateValue);
        setCommentError((prevErrors) => ({
          ...prevErrors,
          [commentUpdate.commentId]: null,
        }));
      }
    } catch (error) {
      setCommentError((prevErrors) => ({
        ...prevErrors,
        [commentUpdate.commentId]: error.message,
      }));
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      const resultAction = await dispatch(deleteComment(id));
      if (deleteComment.rejected.match(resultAction)) {
        throw new Error(resultAction.payload);
      }
      setCommentError((prevErrors) => ({
        ...prevErrors,
        [id]: null,
      }));
    } catch (error) {
      console.log("catch:-", error);
      setCommentError((prevErrors) => ({
        ...prevErrors,
        [id]: error.message,
      }));
      console.log("comment error", commentError);
    }
  };

  return (
    <div className="w-full sm:max-w-[550px] md:max-w-[750px] lg:max-w-[970px] xl:max-w-[1170px] mx-auto px-[15px]">
      <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-center px-8 sm:px-10 md:px-12 lg:px-16">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-5">
          Comments ({commentsData.length})
        </h1>

        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="commentText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Comment
            </label>
            <textarea
              id="commentText"
              value={commentInput.comment}
              onChange={(e) =>
                setCommentInput({ blogPostId: blogId, comment: e.target.value })
              }
              placeholder="Share your thoughts on this article..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E8E59] focus:border-transparent"
              required
              aria-required="true"
            />
          </div>

          {newError && (
            <div className="mt-2">
              <p className="text-sm text-red-500">{newError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#6E8E59] text-white rounded-lg hover:bg-[#5d7a4a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E8E59] disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Submit comment"
          >
            Post Comment
          </button>
        </form>

        {/* comments */}
        <div className="space-y-6">
          {commentsData && commentsData?.length ? (
            commentsData.map((comment, key) => (
              <div
                key={key}
                className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    {capitalizeUserName(comment.author.username)}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {isCommentUpdate && commentUpdate.commentId === comment._id ? (
                  <form
                    onSubmit={handleUpdateComment}
                    className="flex flex-col"
                  >
                    <input
                      type="text"
                      className="bg-white border rounded-xs px-2"
                      value={commentUpdate.comment}
                      onChange={(e) => {
                        setCommentUpdate({
                          ...commentUpdate,
                          comment: e.target.value,
                        });
                      }}
                    />
                    {commentError[comment._id] && (
                      <p className="text-sm text-red-500">
                        {commentError[comment._id]}
                      </p>
                    )}
                    <div className="flex mt-2 gap-x-3">
                      <button
                        type="submit"
                        className={`transition duration-100 ease-in cursor-pointer hover:bg-blue-600 text-sm rounded-xs font-medium px-2 bg-blue-400 text-white disabled:opacity-70 disabled:cursor-not-allowed ${
                          isCommentUpdate ? "" : "hidden"
                        }`}
                        disabled={load}
                      >
                        Update
                      </button>
                      <button
                        className={`transition duration-100 ease-in cursor-pointer hover:bg-red-600 text-sm rounded-xs font-medium px-2 bg-red-400 text-white disabled:opacity-70 disabled:cursor-not-allowed ${
                          isCommentUpdate ? "" : "hidden"
                        }`}
                        onClick={() => {
                          setIsCommentUpdate(false);
                          setCommentUpdate(updateValue);
                        }}
                        disabled={load}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-800">{comment.comment}</p>
                )}
                {currentUser && currentUser.id === comment.author._id && (
                  <div className="flex mt-2 gap-x-3">
                    <button
                      className={`transition duration-100 ease-in cursor-pointer hover:bg-blue-600 text-sm rounded-xs font-medium px-2 bg-blue-400 text-white disabled:opacity-70 disabled:cursor-not-allowed ${
                        isCommentUpdate ? "hidden" : ""
                      }`}
                      onClick={() => {
                        setIsCommentUpdate(true);
                        setCommentUpdate({
                          commentId: comment._id,
                          comment: comment.comment,
                        });
                      }}
                      disabled={load}
                    >
                      Edit
                    </button>
                    <button
                      className={`transition duration-100 ease-in cursor-pointer hover:bg-red-600 text-sm rounded-xs font-medium px-2 bg-red-400 text-white disabled:opacity-70 disabled:cursor-not-allowed ${
                        isCommentUpdate ? "hidden" : ""
                      }`}
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={load}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {commentError[comment._id] && (
                  <p className="text-sm text-red-500">
                    {commentError[comment._id]}
                  </p>
                )}
                <div className="flex mt-2 gap-x-3">
                  <button
                    disabled={load}
                    className="transition duration-100 ease-in cursor-pointer hover:bg-gray-600 text-sm rounded-xs font-medium px-2 pb-0.5 bg-gray-400 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
