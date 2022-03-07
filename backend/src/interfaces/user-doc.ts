import mongoose, { Document } from 'mongoose';

export interface UserDoc extends Document {
    name: string;
    email: string;
    password: number;
    imageUrl: string;
    places: {
        type: mongoose.Types.ObjectId;
        required?: boolean;
        ref?: string;
    }[];
}
