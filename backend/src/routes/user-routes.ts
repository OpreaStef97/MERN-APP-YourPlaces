import express from 'express';
import {
    changePassword,
    getAllUsers,
    login,
    signup,
} from '../controllers/users-controllers';
import { check } from 'express-validator';
import fileUpload from '../middleware/file-upload';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getAllUsers);
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
router
    .use(checkAuth)
    .post(
        '/changepassword',
        [
            check('email').normalizeEmail().isEmail(),
            check('newpassword').isLength({ min: 6 }),
        ],
        changePassword
    );

export default router;
