import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/use-http';
import { useEffect, useState } from 'react';
import { PlaceData } from '../types/place-type';

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState<PlaceData[]>();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        )
            .then(res => {
                setLoadedPlaces(res.data.places);
            })
            .catch(err => {
                console.log(err.message);
            });
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId: string) => {
        setLoadedPlaces(prevPlaces =>
            prevPlaces?.filter(place => place.id !== deletedPlaceId)
        );
    };

    return (
        <>
            <ErrorModal erorr={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={placeDeletedHandler}
                />
            )}
        </>
    );
};

export default UserPlaces;
