import React, { FC, useState, useContext } from 'react';

import { PlaceData } from '../types/place-data';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/use-http';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Map from '../../shared/components/UIElements/Map';
import Modal from '../../shared/components/UIElements/Modal';
import './PlaceItem.css';

const PlaceItem: FC<PlaceData & { onDelete: (id: string) => void }> = props => {
    const authCtx = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = (event: Event) => {
        event.preventDefault();
        setShowMap(false);
    };

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = () => {
        setShowConfirmModal(false);
        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
            'DELETE',
            {
                Authorization: 'Bearer ' + authCtx.token,
            }
        )
            .then(() => {
                props.onDelete(props.id);
            })
            .catch(err => console.log(err.message));
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onSubmit={() => {}}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content map-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} className={''} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </>
                }
            >
                <p>
                    Do you want to proceed and delete this place? Please note
                    that it can't be undone threafter
                </p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__card">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img
                            src={`${process.env.REACT_APP_ASSET_URL}/${props.imageUrl}`}
                            alt={props.title}
                        />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {authCtx.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {authCtx.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;
