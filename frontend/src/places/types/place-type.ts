export type PlaceData = {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    address: string;
    creatorId:
        | string
        | {
              id?: string;
              name?: string;
              imageUrl?: string;
          };
    coordinates: {
        lat: number;
        lng: number;
    };
};
