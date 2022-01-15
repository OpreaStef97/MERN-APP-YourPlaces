import { Handler, NextFunction, Request } from 'express';
import { Response } from 'express-serve-static-core';

const asyncHandler =
    (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };

export default asyncHandler;
