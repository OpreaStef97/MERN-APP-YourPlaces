import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/use-http';
import { useContext, useEffect, useState } from 'react';
import { PlaceData } from '../types/place-type';
import PlaceItem from '../components/PlaceItem';
import './UserPlaces.css';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import useInfiniteScroll from '../../shared/hooks/use-infinite-scroll';

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState<PlaceData[]>([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const authCtx = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const userId = useParams().userId;

    useEffect(() => {
        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}?page=${page}&limit=2`
        )
            .then(res => {
                setLoadedPlaces(prev => [...prev, ...res.data.places]);
                setHasMore(res.data.places.length > 0);
            })
            .catch(err => {
                setHasMore(false);
            });
    }, [page, sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId: string) => {
        setLoadedPlaces(prevPlaces => prevPlaces?.filter(place => place.id !== deletedPlaceId));
    };

    const lastPlaceRef = useInfiniteScroll({ isLoading, hasMore, setPage });

    return (
        <>
            <ErrorModal erorr={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces.length === 0 && (
                <div className="place-list center">
                    <Card>
                        <h2>
                            {authCtx.userId === userId
                                ? 'No places found. Maybe create one?'
                                : 'No places found for this user'}
                        </h2>
                        {authCtx.userId === userId ? (
                            <Button to={'/places/new'}>Share Place</Button>
                        ) : (
                            <Button to={'/'}>&larr; Go back</Button>
                        )}
                    </Card>
                </div>
            )}
            {
                <ul className="place-list">
                    {loadedPlaces?.length > 0 &&
                        loadedPlaces.map((place, idx) => {
                            if (idx + 1 === loadedPlaces.length) {
                                return (
                                    <PlaceItem
                                        key={idx}
                                        ref={lastPlaceRef}
                                        id={place.id}
                                        imageUrl={place.imageUrl}
                                        title={place.title}
                                        description={place.description}
                                        address={place.address}
                                        creatorId={place.creatorId}
                                        coordinates={place.coordinates}
                                        onDelete={placeDeletedHandler}
                                    />
                                );
                            }
                            return (
                                <PlaceItem
                                    key={idx}
                                    id={place.id}
                                    imageUrl={place.imageUrl}
                                    title={place.title}
                                    description={place.description}
                                    address={place.address}
                                    creatorId={place.creatorId}
                                    coordinates={place.coordinates}
                                    onDelete={placeDeletedHandler}
                                />
                            );
                        })}
                </ul>
            }
            )
        </>
    );
};

export default UserPlaces;
