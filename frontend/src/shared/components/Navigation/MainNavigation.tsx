import { FC, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';
import Backdrop from '../UIElements/Backdrop';
import { AuthContext } from '../../context/auth-context';
import Avatar from '../UIElements/Avatar';

const MainNavigation: FC = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (width > 830 && drawerIsOpen) {
            setDrawerIsOpen(false);
        }
    }, [width, drawerIsOpen]);

    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    };

    return (
        <>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

            <SideDrawer show={drawerIsOpen}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks onClick={closeDrawerHandler} />
                </nav>
                <p onClick={closeDrawerHandler}>&times;</p>
            </SideDrawer>

            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={openDrawerHandler}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">YourPlaces</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
                {authCtx.isLoggedIn && (
                    <div className="main-navigation__user">
                        <div
                            className={'main-navigation__avatar'}
                            onClick={() => navigate(`/me`)}
                        >
                            <Avatar
                                image={`${process.env.REACT_APP_ASSET_URL}/${authCtx.imageUrl}`}
                                alt={'logged-user-photo'}
                            />
                        </div>
                        <p onClick={() => navigate(`/me`)}>
                            {authCtx.name?.split(' ')[0]}
                        </p>
                    </div>
                )}
            </MainHeader>
        </>
    );
};

export default MainNavigation;
