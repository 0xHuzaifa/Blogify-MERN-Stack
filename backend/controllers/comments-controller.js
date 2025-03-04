import BlogPost from "../models/BlogPost.js";
import BlogComment from "../models/BlogComment.js";

// Create a BlogComment and add it to a specific blog post
const createBlogComment = async (req, res) => {
  const { blogPostId, comment } = req.body;
  const author = req.userInfo.id;

  try {
    console.log("blogPost Id", blogPostId);
    console.log("comment", comment);
    const blogPost = await BlogPost.exists({ _id: blogPostId });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const newComment = new BlogComment({
      post: blogPostId,
      author,
      comment,
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

const getCommentsByPost = async (postId) => {
  // const { postId } = req.params;

  try {
    const blogPost = await BlogPost.exists({ _id: postId });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const comments = await BlogComment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username");

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "comments post not found",
      });
    }

    return comments;

    // res.status(200).json({
    //   success: true,
    //   messages: "Comments Found Successfully",
    //   comments: comments,
    // });
  } catch (error) {
    console.log(error);
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
      success: false,
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
