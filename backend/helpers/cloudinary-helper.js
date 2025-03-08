import cloudinary from "../config/cloudinary-config.js";

const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const { session } = options;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog_thumbnails",
      timeout: 600000,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error("Error while uploading image to cloudinary", error.message);
  }
};

const deleteFromCloudinary = async (filePublicId, options = {}) => {
  try {
    const { session } = options;
    await cloudinary.uploader.destroy(filePublicId);
  } catch (error) {
    throw new Error(
      "Error while deleting image from cloudinary",
      error.message
    );
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
