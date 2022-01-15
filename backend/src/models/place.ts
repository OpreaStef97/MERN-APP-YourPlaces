import mongoose from 'mongoose';
import { PlaceDoc } from '../interfaces/place-doc';

const { Schema } = mongoose;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
});

export default mongoose.model<PlaceDoc>('Place', placeSchema);
