import { FC } from 'react';

import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';
import UserItem from './UserItem';
import UserData from '../types/user-type';

const UsersList: FC<{ items: UserData[] }> = props => {
    if (props.items.length === 0) {
        return (
            <Card>
                <div className="center">
                    <h2>No users found.</h2>
                </div>
            </Card>
        );
    }

    return (
        <ul className={'users-list'}>
            {props.items.map(user => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    imageUrl={user.imageUrl}
                    name={user.name}
                    places={user.places.length}
                />
            ))}
        </ul>
    );
};

export default UsersList;
