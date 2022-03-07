import express from 'express';
import { check } from 'express-validator';
import {
    createPlace,
    deletePlace,
    getAllPlaces,
    getPlaceById,
    getPlacesByUserId,
    updatePlace,
} from '../controllers/places-controllers';
import fileUpload from '../middleware/file-upload';
import checkAuth from '../middleware/check-auth';
import { resizeImage } from '../middleware/resize-image';

const router = express.Router();

router.get('/', getAllPlaces);

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    resizeImage({ place: true }),
    [
        check('title').not().isEmpty(),
        check('description').isLength({
            min: 5,
        }),
        check('address').not().isEmpty(),
    ],
    createPlace
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({
            min: 5,
        }),
    ],
    updatePlace
);

router.delete('/:pid', deletePlace);

export default router;
