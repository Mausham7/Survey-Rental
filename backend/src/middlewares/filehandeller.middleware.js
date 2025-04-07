// filehandeller.middleware.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}`;
    // Store the filename in the request object to access it in the controller
    req.uploadedFileName = `uploads/${filename}`;
    cb(null, filename);
  }
});

const upload2 = multer({ storage });

export { upload2 };