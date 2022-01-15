import mongoose from 'mongoose';
import { UserDoc } from '../interfaces/user-doc';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    imageUrl: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});

export default mongoose.model<UserDoc>('User', userSchema);
