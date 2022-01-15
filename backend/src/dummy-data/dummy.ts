import { PlaceData } from '../types/place-data';

export const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'test@test.com',
        password: 'testers',
    },
];

export const DUMMY_PLACES: PlaceData[] = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg',
        address: '20 W 34th St, New York, NY 10001, Statele Unite ale Americii',
        coordinates: {
            lat: 40.7484564,
            lng: -73.9943977,
        },
        creatorId: 'u1',
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg',
        address: '20 W 34th St, New York, NY 10001, Statele Unite ale Americii',
        coordinates: {
            lat: 40.7484564,
            lng: -73.9943977,
        },
        creatorId: 'u2',
    },
];
