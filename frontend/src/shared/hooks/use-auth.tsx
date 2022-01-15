import { useCallback, useEffect, useReducer } from 'react';
import { LoginState} from '../types/auth-data';

let logoutTimer: NodeJS.Timeout;

type Action = {
    type: string;
    payload: any;
};

const initialState: LoginState = {
    name: null,
    userId: null,
    token: null,
    imageUrl: null,
    expirationDate: null,
};

const authReducer = (state: LoginState, action: Action): LoginState => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return initialState;
    }
};

export const useAuth = () => {
    const [authState, dispatch] = useReducer(authReducer, initialState);

    const login = useCallback(
        (userId, token, expirationDate, imageUrl, name) => {
            const tokenExpirationDate =
                expirationDate ||
                new Date(new Date().getTime() + 60 * 60 * 1000);

            dispatch({
                type: 'CHANGE',
                payload: {
                    userId,
                    token,
                    imageUrl,
                    name,
                    expirationDate: tokenExpirationDate,
                },
            });

            localStorage.setItem(
                'userData',
                JSON.stringify({
                    userId: userId,
                    token: token,
                    expiration: tokenExpirationDate.toISOString(),
                    imageUrl,
                    name,
                })
            );
        },
        []
    );

    useEffect(() => {
        let returnObj = localStorage.getItem('userData');
        let storedData;
        if (typeof returnObj === 'string') storedData = JSON.parse(returnObj);

        if (
            storedData &&
            storedData.token &&
            storedData.imageUrl &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration),
                storedData.imageUrl,
                storedData.name
            );
        }
    }, [login]);

    const logout = useCallback(() => {
        dispatch({
            type: 'CHANGE',
            payload: {
                name: null,
                userId: null,
                token: null,
                imageUrl: null,
                expirationDate: null,
            },
        });

        localStorage.removeItem('userData');
    }, []);

    const { token, expirationDate } = authState;

    useEffect(() => {
        if (token && expirationDate) {
            const remainingTime =
                expirationDate.getTime() - new Date().getTime();

            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [logout, token, expirationDate]);

    return {
        isLoggedIn: !!token,
        login,
        logout,
        ...authState,
    };
};
