import express from 'express';
import { getAllUsers, login, signup } from '../controllers/users-controllers';
import { check } from 'express-validator';
import fileUpload from '../middleware/file-upload';

const router = express.Router();

router.get('/', getAllUsers)
router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    signup
);
router.post('/login', check('email').not().isEmpty(), login);

export default router;
