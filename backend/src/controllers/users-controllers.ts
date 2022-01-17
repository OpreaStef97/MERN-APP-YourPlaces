import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signAsyncJWT } from '../util/async-jwt';

import AppError from '../models/app-error';
import User from '../models/users';
import { validationResult } from 'express-validator';
import asyncHandler from '../util/async-handler';
import { UserDoc } from '../interfaces/user-doc';

export const getAllUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find().select('-password -email');

        if (!users) return next(new AppError(404, 'No user found'));

        res.status(200).json({
            users: users.map(user => user.toObject({ getters: true })),
        });
    }
);

export const changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new AppError(
                    422,
                    'Invalid inputs passed, please check your email and password.'
                )
            );
        }

        // search for user

        const { email, oldpassword, newpassword } = req.body;

        const identifiedUser = await User.findOne({ email });

        if (!identifiedUser) {
            return next(new AppError(400, 'Token is invalid or has expired'));
        }

        // check if identifiedUser is logged in

        if (identifiedUser.id.toString() !== req.userData.userId) {
            return next(
                new AppError(
                    401,
                    'You need to be logged in to perform this action'
                )
            );
        }

        // check password
        const isValidPassword = await bcrypt.compare(
            oldpassword,
            identifiedUser.password.toString()
        );

        if (!isValidPassword) {
            return next(new AppError(401, 'Your current password is wrong'));
        }

        // password is correct

        const hashedPassword = await bcrypt.hash(newpassword, 12);

        await identifiedUser.updateOne({ password: hashedPassword });

        res.status(201).json({
            message: 'Password Updated',
        });
    }
);

export const signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new AppError(
                    422,
                    'Invalid inputs passed, please check your data.'
                )
            );
        }

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const createdUser = new User({
            name,
            email,
            password: hashedPassword,
            imageUrl: req.file?.path,
            places: [],
        });

        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            return next(
                new AppError(
                    500,
                    'Something went wrong. Please try again later.'
                )
            );
        }

        const token = await signAsyncJWT(
            {
                userId: createdUser.id,
                email: createdUser.email,
                imageUrl: createdUser.imageUrl,
                name: createdUser.name,
            },
            secretKey
        );

        await createdUser.save();

        res.status(201).json({
            token,
        });
    }
);

export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new AppError(422, 'Please provide an email!'));
        }

        const { email, password } = req.body;

        const identifiedUser = await User.findOne({ email });

        if (!identifiedUser) {
            return next(
                new AppError(401, 'Invalid credentials, could not log you in.')
            );
        }

        const isValidPassword = await bcrypt.compare(
            password,
            identifiedUser.password.toString()
        );

        if (!isValidPassword) {
            return next(
                new AppError(401, 'Invalid credentials, could not log you in.')
            );
        }

        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            return next(
                new AppError(
                    500,
                    'Something went wrong, please try again later.'
                )
            );
        }

        const token = await signAsyncJWT(
            {
                userId: identifiedUser.id,
                email: identifiedUser.email,
                imageUrl: identifiedUser.imageUrl,
                name: identifiedUser.name,
            },
            secretKey
        );

        res.status(200).json({
            token,
        });
    }
);
