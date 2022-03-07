import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import expressLimiter from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

import AppError from './src/models/app-error';
import placesRoutes from './src/routes/places-routes';
import usersRoutes from './src/routes/user-routes';
import errorHandler from './src/controllers/errors-controller';

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 🚨🚨🚨 Shutting down...');
    process.exit(1);
});

dotenv.config({ path: './config.env' });

// APP
////////////////////////////////////////
(async () => {
    const app = express();

    const limiter = expressLimiter({
        max: 200,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP, please try again in an hour',
    });

    app.use('/api', limiter);

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use(bodyParser.json());

    const staticHandler = express.static(path.join('uploads', 'images'));

    app.use('/uploads/images', staticHandler);

    // Body parser, reading data from body into req.body
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    app.use(helmet());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        next();
    });

    app.use('/api/places', placesRoutes);
    app.use('/api/users', usersRoutes);

    app.use((req, res, next) => {
        return next(new AppError(404, 'Could not find this route'));
    });

    // Global ERROR Handler Middleware

    app.use(errorHandler);

    // DATABASE CONNECTION
    /////////////////////////////////////////

    const DB_PASSWORD = process.env.DATABASE_PASSWORD;
    const DB_USERNAME = process.env.USERNAME_DB;
    const DB_CONNECT = process.env.DATABASE;

    if (!DB_PASSWORD || !DB_USERNAME || !DB_CONNECT) {
        throw new Error(`Can't connect to database`);
    }

    const DB = DB_CONNECT.replace('<PASSWORD>', encodeURIComponent(DB_PASSWORD)).replace(
        '<USERNAME>',
        DB_USERNAME
    );

    await mongoose.connect(DB);

    console.log('DB connection succesfull!');
    // SERVER
    ///////////////////////////////////////

    const port = process.env.PORT || 8000;
    const server = app.listen(port, () => {
        console.log(`Listening to port ${port}..`);
    });

    process.on('unhandledRejection', err => {
        console.log(err);
        console.log('UNHANDLED REJECTION! 🚨🚨🚨 Shutting down...');
        server.close(() => {
            process.exit(1);
        });
    });
})();
