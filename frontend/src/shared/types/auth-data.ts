export type LoginContext = {
    isLoggedIn: boolean;
    token: any;
    userId: string | null;
    imageUrl: string | null;
    name: string | null;
    login: (
        uid: string,
        token: any,
        expirationDate?: Date,
        imageUrl?: string,
        name?: string
    ) => void;
    logout: () => void;
    tokenExpirationDate?: Date | null;
};

export type LoginState = {
    token: any;
    userId: string | null;
    imageUrl: string | null;
    name: string | null;
    expirationDate: Date | null;
};
