import axios from 'axios';
import AppError from '../models/app-error';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address: string) {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`
    );

    const { data } = response;

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new AppError(
            422,
            'Could not find location for the specified address.'
        );
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

export default getCoordsForAddress;
