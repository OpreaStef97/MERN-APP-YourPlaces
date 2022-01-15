import React, { FC, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

import { PlaceData } from '../types/place-data';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

const PlaceList: FC<{
    items?: PlaceData[];
    onDeletePlace: (id: string) => void;
}> = props => {
    const { userId } = useParams();
    const authCtx = useContext(AuthContext);

    if (!props.items || props.items.length === 0) {
        return (
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
        );
    }

    return (
        <ul className="place-list">
            {props.items.map(place => (
                <PlaceItem
                    key={place.id}
                    id={place.id}
                    imageUrl={place.imageUrl}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    creatorId={place.creatorId}
                    coordinates={place.coordinates}
                    onDelete={props.onDeletePlace}
                />
            ))}
        </ul>
    );
};

export default PlaceList;
