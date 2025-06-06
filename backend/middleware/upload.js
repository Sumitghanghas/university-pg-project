const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Create directories if not exist
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir = '';

        if (file.fieldname === 'images' || file.fieldname === 'pgImage') {
            uploadDir = 'uploads/pgImages';
        } else if (file.fieldname === 'pgVideo') {
            uploadDir = 'uploads/pgVideos';
        } else {
            return cb(new Error('Invalid fieldname'), false);
        }

        ensureDirectoryExistence(uploadDir);
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

// Allowed MIME types and extensions for images
const allowedImageMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'image/svg+xml', 'image/bmp', 'image/tiff', 'image/heic'
];

const allowedImageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.heic'
];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeValid = allowedImageMimeTypes.includes(file.mimetype);
    const isExtValid = allowedImageExtensions.includes(ext);

    if (isMimeValid && isExtValid) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

module.exports = upload;
