import { FC, useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/use-http';
import useInfiniteScroll from '../../shared/hooks/use-infinite-scroll';
import useWindow from '../../shared/hooks/use-window';
import shuffleArray from '../../shared/util/shuffle-array';
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
    const [loadedPlaces, setLoadedPlaces] = useState<PlaceResult[]>([]);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places?page=${page}&limit=6`)
            .then(res => {
                const { places } = res.data;
                shuffleArray(places);
                setLoadedPlaces(prev => {
                    return [...prev, ...places];
                });
                setHasMore(res.data.places.length > 0);
            })
            .catch(err => setHasMore(false));
    }, [page, sendRequest]);

    const lastPlaceImage = useInfiniteScroll({ isLoading, setPage, hasMore });

    const [width] = useWindow();

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}
            <ul className="wrapper" style={{ paddingLeft: 0 }}>
                {loadedPlaces.length > 0 &&
                    loadedPlaces.map((loadedPlace, idx) => {
                        if (idx + 1 === loadedPlaces.length) {
                            return (
                                <PlaceImage
                                    ref={lastPlaceImage}
                                    key={idx}
                                    title={loadedPlace.title}
                                    className={`panel ${
                                        (width <= 830 || idx % 3 === 0) && 'panel-big'
                                    }`}
                                    address={loadedPlace.address}
                                    imageUrl={loadedPlace.imageUrl}
                                    coordinates={loadedPlace.coordinates}
                                    creatorId={loadedPlace.creatorId.id}
                                    creatorName={loadedPlace.creatorId.name}
                                    creatorImage={loadedPlace.creatorId.imageUrl}
                                />
                            );
                        }
                        return (
                            <PlaceImage
                                key={idx}
                                title={loadedPlace.title}
                                className={`panel ${
                                    (width <= 830 || idx % 3 === 0) && 'panel-big'
                                }`}
                                address={loadedPlace.address}
                                imageUrl={loadedPlace.imageUrl}
                                coordinates={loadedPlace.coordinates}
                                creatorId={loadedPlace.creatorId.id}
                                creatorName={loadedPlace.creatorId.name}
                                creatorImage={loadedPlace.creatorId.imageUrl}
                            />
                        );
                    })}
            </ul>
        </>
    );
};

export default Places;
