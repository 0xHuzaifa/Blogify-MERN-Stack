import BlogPost from "../models/BlogPost.js";
import BlogComment from "../models/BlogComment.js";

// Create a BlogComment and add it to a specific blog post
const createBlogComment = async (req, res) => {
  const { blogPostId, comment, parentCommentId } = req.body;
  const author = req.userInfo.id;
  console.log("parent comment", parentCommentId);
  try {
    const blogPost = await BlogPost.exists({ _id: blogPostId });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    if (parentCommentId && parentCommentId.trim() !== "") {
      const parentComment = await BlogComment.findById({
        _id: parentCommentId,
      });
      if (!parentComment || parentComment.post.toString() !== blogPostId) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }
    }

    const newComment = new BlogComment({
      post: blogPostId,
      author,
      comment,
      parentComment:
        parentCommentId && parentCommentId.trim() !== ""
          ? parentCommentId
          : null,
    });
    await newComment.save();

    const populatedComment = await BlogComment.findById(
      newComment._id
    ).populate("author", "username");

    res.status(201).json({
      success: true,
      message: "Comment Successfully Posted",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const blogPost = await BlogPost.exists({ _id: postId });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const comments = await BlogComment.find({
      post: postId,
      parentComment: null, // Top-level comments only
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("author", "username")
      .populate({
        path: "replies", // populate replies virtual field
        select: "comment author createdAt",
        populate: { path: "author", select: "username" },
        options: { sort: { createdAt: 1 } },
      });

    if (!comments) {
      throw new Error("Comments not found");
    }

    const totalComments = await BlogComment.countDocuments({
      post: postId,
      parentComment: null,
    });

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      comments: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
      },
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({
      success: false,
      message: error.message.includes("not found")
        ? error.message
        : "Something went wrong, please try again",
    });
  }
};

// Update a BlogComment
const updateBlogComment = async (req, res) => {
  const { commentId, comment } = req.body;
  const currentUser = req.userInfo.id;

  try {
    const blogComment = await BlogComment.findById(commentId);
    if (!blogComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (blogComment.author.toString() !== currentUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this Comment",
      });
    }

    const updateComment = await BlogComment.findByIdAndUpdate(
      commentId,
      {
        comment: comment,
      },
      { new: true, runValidators: true }
    ).populate("author", "username");

    res.status(200).json({
      success: true,
      message: "Comment Updated Successfully",
      comment: updateComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a BlogComment
const deleteBlogComment = async (req, res) => {
  const { commentId } = req.body;
  const currentUser = req.userInfo.id;

  try {
    const blogComment = await BlogComment.findById(commentId);
    if (!blogComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (blogComment.author.toString() !== currentUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this Comment",
      });
    }

    const deletedComment = await BlogComment.findByIdAndDelete(
      commentId
    ).populate("author", "username");

    res.status(200).json({
      success: true,
      message: "Comment Deleted",
      comment: deletedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createBlogComment,
  getCommentsByPost,
  updateBlogComment,
  deleteBlogComment,
};
