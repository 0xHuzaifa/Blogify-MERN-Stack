import cloudinary from "../config/cloudinary-config.js"

const uploadToCloudinary = async (filePath) => {
    try {
        
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "blog_thumbnails",
            timeout: 600000
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        }
        
    } catch (error) {
        console.error('Error while uploading image', error);
        throw new Error("Error while uploading image to cloudinary");
    }
}

const deleteFromCloudinary = async (filePublicId) => {
    try {
        await cloudinary.uploader.destroy(filePublicId);

    } catch (error) {
        console.error('Error while deleting image', error);
        throw new Error("Error while deleting image from cloudinary");
    }
}

export {uploadToCloudinary, deleteFromCloudinary}