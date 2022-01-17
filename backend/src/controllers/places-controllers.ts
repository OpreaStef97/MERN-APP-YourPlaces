import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { startSession } from 'mongoose';
import fs from 'fs';

import AppError from '../models/app-error';
import getCoordsForAddress from '../util/location';
import Place from '../models/place';
import asyncHandler from '../util/async-handler';
import User from '../models/users';
import { UserDoc } from '../interfaces/user-doc';

export const getAllPlaces = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const places = await Place.find();

        if (!places || places.length === 0)
            return next(new AppError(500, 'Failed to retrieve places'));

        await Promise.all(
            places.map(async place => {
                const user = (
                    await place.populate<{
                        creatorId: UserDoc;
                    }>('creatorId', '-id -__v -password -email -places')
                ).creatorId;
                return user;
            })
        );

        const results = places.map(place => {
            return {
                ...place.toObject({ getters: true }),
            };
        });

        res.status(200).json({
            data: {
                places: results,
            },
        });
    }
);

export const getPlaceById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const placeId = req.params.pid;
        const place = await Place.findById(placeId);

        if (!place) {
            return next(
                new AppError(404, 'Could not find a place for the provided id')
            );
        }

        res.json({
            data: {
                place: place.toObject({ getters: true }),
            },
        });
    }
);

export const getPlacesByUserId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.uid;
        const places = await Place.find({ creatorId: userId });

        if (!places || places.length === 0) {
            return next(
                new AppError(
                    404,
                    'Could not find any place for the provided id'
                )
            );
        }

        res.json({
            data: {
                places: places.map(place => place.toObject({ getters: true })),
            },
        });
    }
);

export const createPlace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(
                new AppError(
                    422,
                    'Invalid inputs passed, please check your data.'
                )
            );
        }

        const { title, description, address } = req.body;

        const coordinates = await getCoordsForAddress(address);

        const creatorId = req.userData.userId;

        const createdPlace = new Place({
            title,
            description,
            address,
            coordinates,
            imageUrl: req.file?.path,
            creatorId,
        });

        const user = await User.findById(creatorId);

        if (!user) {
            return next(
                new AppError(404, 'Could not find user for provided id')
            );
        }

        const sess = await startSession();

        // DB Transaction
        sess.startTransaction();

        await createdPlace.save({ session: sess });

        user.places.push(createdPlace._id);

        await user.save({ session: sess });

        await sess.commitTransaction();

        res.status(201).json({
            data: createdPlace.toObject({ getters: true }),
        });
    }
);

export const updatePlace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(
                new AppError(
                    422,
                    'Invalid inputs passed, please check your data.'
                )
            );
        }

        const placeId = req.params.pid;

        const place = await Place.findById(placeId);

        if (!place) {
            return next(
                new AppError(404, 'Could not find a place for the provided id')
            );
        }

        if (
            !req.userData ||
            place.creatorId.toString() !== req.userData.userId.toString()
        ) {
            return next(
                new AppError(401, 'You are not allowed to edit this place.')
            );
        }

        Object.assign(place, req.body);

        await place.save();

        res.status(201).json({
            data: place.toObject({ getters: true }),
        });
    }
);

export const deletePlace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const placeId = req.params.pid;

        const place = await Place.findById(placeId).populate<{
            creatorId: UserDoc;
        }>('creatorId');

        if (!place) {
            return next(new AppError(500, 'Could not delete place'));
        }

        if (place.creatorId.id.toString() !== req.userData.userId.toString()) {
            return next(
                new AppError(401, 'You are not allowed to edit this place.')
            );
        }

        const imagePath = place.imageUrl;

        // DB Transaction
        const sess = await startSession();

        sess.startTransaction();

        await place.remove({ session: sess });

        const idx = place.creatorId.places.findIndex(el => el == place._id);
        place.creatorId.places.splice(idx, 1);

        await place.creatorId.save({ session: sess });

        await sess.commitTransaction();

        fs.unlink(imagePath.toString(), err => {
            console.log(err);
        });

        res.status(204).json({
            message: 'Place deleted',
        });
    }
);
