export type TokenData = {
    email: string;
    userId: string;
    imageUrl: string;
    name: string;
    exp: number;
    iat: number;
};

export function isTokenData(object: unknown): object is TokenData {
    return (
        Object.prototype.hasOwnProperty.call(object, 'email') &&
        Object.prototype.hasOwnProperty.call(object, 'userId') &&
        Object.prototype.hasOwnProperty.call(object, 'imageUrl') &&
        Object.prototype.hasOwnProperty.call(object, 'name') &&
        Object.prototype.hasOwnProperty.call(object, 'exp') &&
        Object.prototype.hasOwnProperty.call(object, 'iat')
    );
}
