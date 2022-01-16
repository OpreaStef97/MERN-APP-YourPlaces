import { FC, useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/use-http';
import PlaceImage from '../components/PlaceImage';
import { PlaceData } from '../types/place-type';
import './Places.css';

interface PlaceResult extends PlaceData {
    creatorId: {
        id?: string;
        name?: string;
        imageUrl?: string;
    };
}

const Places: FC = props => {
    const [loadedPlaces, setLoadedPlaces] = useState<PlaceResult[]>();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'GET')
            .then(res => {
                setLoadedPlaces(res.data.places);
            })
            .catch(err => console.log(err));
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            <div className="wrapper">
                {loadedPlaces &&
                    loadedPlaces.length > 0 &&
                    loadedPlaces.map((loadedPlace, idx) => {
                        let className = 'panel';

                        if (idx % 3 === 0) {
                            className = 'panel panel-big';
                        }
                        return (
                            <PlaceImage
                                key={loadedPlace.id}
                                title={loadedPlace.title}
                                className={className}
                                address={loadedPlace.address}
                                imageUrl={loadedPlace.imageUrl}
                                coordinates={loadedPlace.coordinates}
                                creatorId={loadedPlace.creatorId.id}
                                creatorName={loadedPlace.creatorId.name}
                                creatorImage={loadedPlace.creatorId.imageUrl}
                            />
                        );
                    })}
            </div>
        </>
    );
};

export default Places;
