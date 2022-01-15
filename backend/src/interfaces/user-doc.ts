import mongoose, { Document } from 'mongoose';

export interface UserDoc extends Document {
    name: { type: string; required?: boolean; maxlength?: number };
    email: { type: string; required?: boolean; unique?: boolean };
    password: { type: string; required?: boolean; minlength?: number };
    imageUrl: { type: string; required?: boolean };
    places: {
        type: mongoose.Types.ObjectId;
        required?: boolean;
        ref?: string;
    }[];
}
