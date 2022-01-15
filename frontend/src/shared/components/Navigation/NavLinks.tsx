import { FC, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

const NavLinks: FC<{
    imageUrl?: string;
    name?: string;
    onClick?: () => void;
}> = props => {
    const authCtx = useContext(AuthContext);
    return (
        <ul className="nav-links">
            <li>
                <NavLink onClick={props.onClick} to="/">
                    ALL USERS
                </NavLink>
            </li>
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink
                        onClick={props.onClick}
                        to={`/${authCtx.userId}/places`}
                    >
                        MY PLACES
                    </NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink onClick={props.onClick} to="/places/new">
                        ADD PLACE
                    </NavLink>
                </li>
            )}
            {!authCtx.isLoggedIn && (
                <li>
                    <NavLink onClick={props.onClick} to="/auth">
                        LOGIN
                    </NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li onClick={props.onClick}>
                    <button onClick={authCtx.logout}>LOGOUT</button>
                </li>
            )}
        </ul>
    );
};
export default NavLinks;
