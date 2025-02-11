import mongoose, { set } from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required : [true, 'Username is required!'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 character long'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
    },

    email: {
        type: String,
        required : [true, 'Email is required!'],
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required : [true, 'Password is required!'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },

    phone: {
        type: Number,
        required : [true, 'Phone NO is required!'],
        minlength: [11, 'Phone NO must be at least 11 characters long'],
        trim: true,
    },

    dob: {
        type: Date,
        required: true,
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required!'],
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true});

export default mongoose.model('User', UserSchema) 