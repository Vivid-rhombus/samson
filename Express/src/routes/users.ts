import { Router } from 'express';
import validate from 'express-joi-validations';

import {
	userSchema,
	updateUserSchema,
	userIdSchema,
} from '../validations/users';
import {
	getUser,
	getUsers,
	postUser,
	updateUser,
	deleteUser,
} from '../handlers/users';
const router = Router();

router.get('/', getUsers);
router.get('/:id', validate({ params: userIdSchema }), getUser);
router.patch(
	'/:id',
	validate({ params: userIdSchema, body: updateUserSchema }),
	updateUser
);
router.delete('/:id', validate({ params: userIdSchema }), deleteUser);
router.post('/', validate({ body: userSchema }), postUser);

export default router;
