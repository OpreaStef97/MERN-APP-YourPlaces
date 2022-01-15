import { createContext, FC } from 'react';
import { LoginContext } from '../types/auth-data';
import { useAuth } from '../hooks/use-auth';

const initialState: LoginContext = {
    isLoggedIn: false,
    token: null,
    userId: null,
    email: null,
    imageUrl: null,
    name: null,
    login: () => {},
    logout: () => {},
};

export const AuthContext = createContext(initialState);

const AuthContextProvider: FC = props => {
    const newState: LoginContext = {
        ...useAuth(),
    };

    return (
        <AuthContext.Provider value={newState}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
