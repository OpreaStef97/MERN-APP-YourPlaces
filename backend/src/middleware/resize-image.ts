import sharp from 'sharp';
import { v1 as uuid } from 'uuid';
import asyncHandler from '../util/async-handler';

export const resizeImage = ({ user, place }: { user?: boolean; place?: boolean }) =>
    asyncHandler(async (req, res, next) => {
        if (!req.file) return next();

        if (user) {
            req.file.filename = `user-${uuid()}.jpeg`;

            await sharp(req.file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/${req.file.filename}`);
        }

        if (place) {
            req.file.filename = `place-${uuid()}.jpeg`;
            await sharp(req.file.buffer)
                .toFormat('jpeg')
                .jpeg({ quality: 70, progressive: true, force: false })
                .toFile(`public/images/${req.file.filename}`);
        }

        next();
    });
