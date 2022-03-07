import { useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/use-http';
import Card from '../../shared/components/UIElements/Card';
import UserItem from '../components/UserItem';
import '../components/UsersList.css';
import useInfiniteScroll from '../../shared/hooks/use-infinite-scroll';

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users?page=${page}&limit=10`)
            .then(responseData => {
                const { users } = responseData;
                setLoadedUsers(prev => [...prev, ...users]);
                setHasMore(responseData.users.length > 0);
            })
            .catch(err => setHasMore(false));
    }, [page, sendRequest]);

    const lastUserRef = useInfiniteScroll({ isLoading, hasMore, setPage });

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}
            {loadedUsers.length > 0 && (
                <>
                    {loadedUsers.length === 0 && (
                        <Card>
                            <div className="center">
                                <h2>No users found.</h2>
                            </div>
                        </Card>
                    )}
                    <ul className={'users-list'}>
                        {loadedUsers.length > 0 &&
                            loadedUsers.map((user, idx) => {
                                if (idx + 1 === loadedUsers.length) {
                                    return (
                                        <UserItem
                                            ref={lastUserRef}
                                            key={idx}
                                            id={user.id}
                                            imageUrl={user.imageUrl}
                                            name={user.name}
                                            places={user.places.length}
                                        />
                                    );
                                }

                                return (
                                    <UserItem
                                        key={idx}
                                        id={user.id}
                                        imageUrl={user.imageUrl}
                                        name={user.name}
                                        places={user.places.length}
                                    />
                                );
                            })}
                    </ul>
                </>
            )}
        </>
    );
};

export default Users;
