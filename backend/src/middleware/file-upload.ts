import multer from 'multer';

const MIME_TYPE_MAP: { [s: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const fileUpload = multer({
    limits: {
        fileSize: 1000000,
    },
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (!isValid) return cb(new Error('Invalid mime type!'));
        cb(null, isValid);
    },
});

export default fileUpload;