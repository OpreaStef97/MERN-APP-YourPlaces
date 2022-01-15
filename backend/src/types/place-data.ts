export type PlaceData = {
    id?: string;
    imageUrl?: string;
    title?: string;
    description?: string;
    address?: string;
    creatorId?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
};
