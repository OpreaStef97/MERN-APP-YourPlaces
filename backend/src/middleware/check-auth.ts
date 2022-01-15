import { NextFunction, Request, Response } from 'express';
import AppError from '../models/app-error';
import asyncHandler from '../util/async-handler';
import { verifyAsyncJWT } from '../util/async-jwt';


export default asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'OPTIONS') {
            return next();
        }

        const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            return next(new AppError(403, 'Authentication failed!'));
        }

        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            return next(
                new AppError(
                    500,
                    'Something went wrong. Please try again later.'
                )
            );
        }

        const decodedToken = await verifyAsyncJWT(token, secretKey);

        req.userData = { userId: decodedToken.userId };

        next();
    }
);
