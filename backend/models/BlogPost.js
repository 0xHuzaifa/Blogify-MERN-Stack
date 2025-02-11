import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required. Please Provide the Title of the Post'],
        maxlength: [20, 'Title do not exceeds 20 characters']
    },

    content: {
        type: String,
        required: [true, 'Content is required. Please Provide the content of the Post'],
        minlength: [100, 'Content must be at least 100 characters'],
        maxlength: [500, 'Content do not exceeds 500 characters'],
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },

    thumbnail: {
        url: {
            type: String,
            required: [true, 'Thumbnail URL is required'],
        },
        publicId: {
            type: String,
            required: [true, 'Thumbnail Public Id is required'],
        },
    },

    tags: {
        type: [String],
        required: [true, 'Tags are required']
    }
}, {timestamps: true});

export default mongoose.model('BlogPost', BlogPostSchema)

