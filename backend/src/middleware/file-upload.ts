import multer from 'multer';
import { v1 as uuid } from 'uuid';

type MimeType = {
    [s: string]: string;
};

const MIME_TYPE_MAP: MimeType = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const fileUpload = multer({
    limits: {
        fileSize: 1000000,
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (!isValid) return cb(new Error('Invalid mime type!'));
        cb(null, isValid);
    },
});

export default fileUpload;
