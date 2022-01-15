import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import AppError from '../models/app-error';

export const verifyAsyncJWT = (
    token: string,
    secretKey: Secret
): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err || !decodedToken)
                return reject(new AppError(403, 'Authentication failed!'));
            return resolve(decodedToken);
        });
    });
};

export const signAsyncJWT = (
    payload: string | object | Buffer,
    secretKey: Secret
): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
            if (err || !token)
                return reject(
                    new AppError(
                        500,
                        (err && err.message) || 'Something went wrong'
                    )
                );
            return resolve(token);
        });
    });
};
