/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Response } from 'express';
import { Request } from 'express-serve-static-core';
import AppError from '../models/app-error';
import fs from 'fs';

const handleCastErrorDB = (err: { path: any; value: any }) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err: { keyValue: { [s: string]: any } }) => {
    const { keyValue } = err;
    const value = keyValue[Object.keys(keyValue)[0]];

    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(400, message);
};

const handleValidationErrorDB = (err: {
    errors: { [s: string]: any } | ArrayLike<any>;
}) => {
    const errors = Object.values(err.errors).map(error => error.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(400, message);
};

const handleJWTError = () =>
    new AppError(401, 'Invalid token. Please log in again');

const handleJWTExpiredError = () =>
    new AppError(401, 'Your token has expired. Please log in again');

const sendErrorDev: ErrorRequestHandler = (err, req, res) => {
    console.error('ERROR 🚨:', err);
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd: ErrorRequestHandler = (err, req, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Proggramming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 🚨:', err);

    // 2) Send generic message
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
    });
};

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res, next);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res, next);
    }

    next();
};

export default errorHandler;
