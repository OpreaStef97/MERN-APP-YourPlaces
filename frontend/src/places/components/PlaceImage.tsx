import React, { RefObject, useEffect, useRef, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Avatar from '../../shared/components/UIElements/Avatar';

import './PlaceImage.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';

import useClickOutside from '../../shared/hooks/use-click-outside';

const PlaceImage = React.forwardRef(
    (
        props: {
            title?: string;
            imageUrl?: string;
            className?: string;
            isLoading?: boolean;
            address?: string;
            coordinates?: any;
            creatorId?: string;
            creatorName?: string;
            creatorImage?: string;
        },
        Fref
    ) => {
        const [loaded, setLoaded] = useState(false);
        const navigate = useNavigate();
        const [showMap, setShowMap] = useState(false);
        const [showDescription, setShowDescription] = useState(false);

        const ref = useRef<HTMLDivElement>(null);

        const { clicked, clearClick } = useClickOutside(ref);

        useEffect(() => {
            if (clicked) {
                setShowDescription(false);
            }
            clearClick();
        }, [clearClick, clicked]);

        const openMapHandler = () => {
            setShowMap(true);
        };

        const closeMapHandler = (event: Event) => {
            event?.preventDefault();
            setShowMap(false);
        };

        return (
            <>
                <Modal
                    show={showMap}
                    onSubmit={() => {}}
                    onCancel={closeMapHandler}
                    header={props.address}
                    contentClass="place-image__modal-content map-content"
                    footerClass="place-image__modal-actions"
                    footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
                >
                    <div className="map-container">
                        <Map center={props.coordinates} zoom={16} className={''} />
                    </div>
                </Modal>
                <div
                    ref={Fref as unknown as RefObject<HTMLDivElement>}
                    className={`place-image ${props.className}`}
                    onClick={e => {
                        setShowDescription(prev => !prev);
                    }}
                >
                    {!loaded && <LoadingSpinner />}
                    <img
                        className="place-image__main-image"
                        style={loaded ? {} : { display: 'none' }}
                        src={`${process.env.REACT_APP_ASSET_URL}/${props.imageUrl}`}
                        alt="placeimage"
                        onLoad={() => setLoaded(true)}
                    />

                    <div
                        className={`place-image__description ${
                            showDescription ? 'active' : 'close'
                        }`}
                        ref={ref}
                    >
                        <p className="place-image__description-title">{props.title}</p>
                        <div className="place-image__user">
                            <div onClick={() => navigate(`/${props.creatorId}/places`)}>
                                <Avatar
                                    className="place-image__creator-avatar"
                                    image={`${process.env.REACT_APP_ASSET_URL}/${props.creatorImage}`}
                                    alt={`${props.creatorName}' photo`}
                                />
                            </div>
                            <span>
                                Shared by <em>{props.creatorName}</em>
                            </span>
                        </div>
                        <div className="button-box">
                            <Button className={'clear-margin'} inverse onClick={openMapHandler}>
                                See on map
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

export default PlaceImage;
