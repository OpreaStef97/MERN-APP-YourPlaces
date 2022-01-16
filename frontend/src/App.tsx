import { Navigate, Routes, Route } from 'react-router-dom';
import React, { useContext, Suspense } from 'react';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Places = React.lazy(() => import('./places/pages/Places'));
const Me = React.lazy(() => import('./user/pages/Me'));
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
    const { token } = useContext(AuthContext);

    let routes;
    if (token) {
        routes = (
            <>
                <Route path="/" element={<Places />} />
                <Route path="/me" element={<Me />} />
                <Route path="/users" element={<Users />} />
                <Route path="/:userId/places" element={<UserPlaces />} />
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
                <Route path="*" element={<Navigate to="/" />} />
            </>
        );
    } else {
        routes = (
            <>
                <Route path="/" element={<Places />} />
                <Route path="/users" element={<Users />} />
                <Route path="/:userId/places" element={<UserPlaces />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </>
        );
    }

    return (
        <>
            <MainNavigation />
            <main>
                <Suspense
                    fallback={
                        <div className="center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <Routes>{routes}</Routes>
                </Suspense>
            </main>
        </>
    );
};

export default App;
