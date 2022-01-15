import mongoose, { Document } from 'mongoose';

export interface PlaceDoc extends Document {
    title: { type: string; required?: boolean };
    description: { type: string; required?: boolean };
    imageUrl: { type: string; required?: boolean };
    address: { type: string; required?: boolean };
    coordinates: {
        lat: { type: number; required?: boolean };
        lng: { type: number; required?: boolean };
    };
    creatorId: {
        type: mongoose.Types.ObjectId;
        required?: boolean;
        ref?: string;
    };
}
