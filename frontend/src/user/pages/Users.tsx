import { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/use-http';

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState<any>();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`, 'GET')
            .then(responseData => {
                setLoadedUsers(responseData.users);
            })
            .catch(err => console.log(err.message));
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner/>
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </>
    );
};

export default Users;
