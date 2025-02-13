import BlogPost from "../models/BlogPost.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../helpers/cloudinary-helper.js";
import fs from "fs/promises";

export const getBlog = async (req, res) => {
  try {
    const getAllBlogPost = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");

    if (!getAllBlogPost || getAllBlogPost === 0) {
      return res.status(400).json({
        success: false,
        message: "No Blog Post Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog Posts Found Successfully",
      totalPost: getAllBlogPost.length,
      posts: getAllBlogPost,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export const getSpecificBlog = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const getBlogPost = await BlogPost.findById(blogPostId);

    if (!getBlogPost) {
      return res.status(400).json({
        success: false,
        message:
          "BlogPost with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog Post Found Successfully",
      posts: getBlogPost,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {
      return res.status(400).json({
        success: false,
        message: "fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image required to upload!",
      });
    }

    // get url and public id of uploaded image for thumbnail
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newBlogPost = new BlogPost({
      title: title,
      content: content,
      author: req.userInfo.id,
      thumbnail: {
        url,
        publicId,
      },
      tags: tags,
    });

    if (!newBlogPost) {
      return res.status(400).json({
        success: false,
        message: "Unable to create new Blog Post. Please try again",
      });
    }

    await newBlogPost.save();

    // delete file from upload folder after upload to cloudinary and add blog to DB
    fs.unlink(req.file.path);

    res.status(201).json({
      success: true,
      message: "New Blog Post created successfully",
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    // current user login
    const currentUserId = req.userInfo.id;

    // find blog
    const currentBlog = await BlogPost.findById(req.params.id);
    // if blog not found
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not exist!",
      });
    }
    // console.log("Current Blog Author",currentBlog.author.toString());
    // console.log("Current User Login", currentUserId.toString());

    // check if the current user is not author of this blog post
    if (currentBlog.author.toString() !== currentUserId.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unable to update! You are not author of this post.",
      });
    }

    // get old thumbnail data
    let thumbnailData = currentBlog.thumbnail;

    // if new file request
    if (req.file) {
      // get public id of previous thumbnail
      if (thumbnailData.publicId) {
        // delete the old thumbnail
        await deleteFromCloudinary(thumbnailData.publicId);
      }

      // get url and public id of new uploaded image for thumbnail
      const { url, publicId } = await uploadToCloudinary(req.file.path);

      thumbnailData = {
        url: url,
        publicId: publicId,
      };
    }

    const { title, content, tags } = req.body;
    // update the current blog
    const updateCurrentBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        thumbnail: thumbnailData,
        tags,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog Post Updated Successfully.",
      post: updateCurrentBlogPost,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    // current user login
    const currentUserId = req.userInfo.id;

    // find blog
    const currentBlog = await BlogPost.findById(req.params.id);
    // if blog not found
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not exist!",
      });
    }

    // check if the current user is not author of this blog post
    if (currentBlog.author.toString() !== currentUserId.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unable to delete! You are not author of this post.",
      });
    }

    // delete thumbnail image from cloudinary
    await deleteFromCloudinary(currentBlog.thumbnail.publicId);
    // delete the current blog
    const deleteCurrentBlogPost = await BlogPost.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Blog Post Deleted Successfully.",
      post: deleteCurrentBlogPost,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};
