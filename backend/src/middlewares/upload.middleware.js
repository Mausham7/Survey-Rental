import multer from 'multer';
import path from 'path';

// Setup Multer storage to save files temporarily before uploading to Google Drive
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define where the file will be saved temporarily
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
  }
});

// Middleware for handling single file uploads
export const uploadMiddleware = multer({ storage: storage });
