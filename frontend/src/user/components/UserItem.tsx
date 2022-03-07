import { RefObject } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

import UserData from '../types/user-type';
import React from 'react';

const UserItem = React.forwardRef((props: UserData, ref) => {
    return (
        <li className="user-item" ref={ref as unknown as RefObject<HTMLLIElement>}>
            <Card className="user-item__content">
                <Link to={`/${props.id}/places`}>
                    <div className="user-item__image">
                        <Avatar
                            image={`${process.env.REACT_APP_ASSET_URL}/${props.imageUrl}`}
                            alt={props.name}
                        />
                    </div>
                    <div className="user-item__info">
                        <h2>{props.name}</h2>
                        <h3>
                            {props.places} {props.places === 1 ? 'Place' : 'Places'}
                        </h3>
                    </div>
                </Link>
            </Card>
        </li>
    );
});

export default UserItem;
