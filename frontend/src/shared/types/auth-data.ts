export type LoginContext = {
    isLoggedIn: boolean;
    token: any;
    userId: string | null;
    email: string | null;
    imageUrl: string | null;
    name: string | null;
    login: (token: any) => void;
    logout: () => void;
    tokenExpirationDate?: Date | null;
};

export type LoginState = {
    token: any;
    isLoggedIn: boolean;
    userId: string | null;
    email: string | null;
    imageUrl: string | null;
    name: string | null;
    exp: number | null;
};
