// import multer from "multer";

// const storage = multer.memoryStorage();

// const checkFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed"), false)
//     }
// }

// const upload = multer({
//     storage: storage,
//     fileFilter: checkFileFilter,
//     limits: {fileSize: 5 * 1024 * 1024},
// });

// export default upload


import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    // destination to file upload
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    // set the file name
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false)
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: checkFileFilter
}); 

export default upload;
