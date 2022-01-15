import { useCallback, useEffect, useReducer } from 'react';
import { LoginState } from '../types/auth-data';
import decodeToken from 'jwt-decode';
import { isTokenData } from '../types/token-data';

let logoutTimer: NodeJS.Timeout;

type Action = {
    type: string;
    payload: any;
};

const initialState: LoginState = {
    isLoggedIn: false,
    token: null,
    name: null,
    email: null,
    userId: null,
    imageUrl: null,
    exp: null,
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

    const login = useCallback(token => {
        const decodedToken = decodeToken(token);

        if (!isTokenData(decodedToken)) {
            return;
        }

        dispatch({
            type: 'CHANGE',
            payload: {
                isLoggedIn: !!token,
                token,
                ...decodedToken,
            },
        });

        localStorage.setItem(
            'userData',
            JSON.stringify({
                token,
                expiration: new Date(decodedToken.exp * 1000),
            })
        );
    }, []);

    useEffect(() => {
        let returnObj = localStorage.getItem('userData');
        let storedData;
        if (typeof returnObj === 'string') storedData = JSON.parse(returnObj);

        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.token);
        }
    }, [login]);

    const logout = useCallback(() => {
        dispatch({
            type: 'CHANGE',
            payload: {
                isLoggedIn: false,
                token: null,
                name: null,
                email: null,
                userId: null,
                imageUrl: null,
                exp: null,
            },
        });

        localStorage.removeItem('userData');
    }, []);

    const { token, exp } = authState;

    useEffect(() => {
        if (token && exp) {
            const remainingTime =
                new Date(exp).getTime() * 1000 - new Date().getTime();

            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [logout, token, exp]);

    return {
        login,
        logout,
        ...authState,
    };
};
