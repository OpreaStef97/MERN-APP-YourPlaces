import mongoose, { Document } from 'mongoose';

export interface PlaceDoc extends Document {
    title: string;
    description: string;
    imageUrl: string;
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    creatorId: {
        type: mongoose.Types.ObjectId;
        required?: boolean;
        ref?: string;
    };
}
