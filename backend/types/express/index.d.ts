/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        userData?: any;
    }
}