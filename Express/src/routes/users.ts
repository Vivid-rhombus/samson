import { Router } from 'express';
import validator from '../middleware/validationMiddleware';

import {
	createUserSchema,
	updateUserSchema,
	idSchema,
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
router.get('/:id', validator({ params: idSchema }), getUser);
router.patch(
	'/:id',
	validator({ params: idSchema, body: updateUserSchema }),
	updateUser
);
router.delete('/:id', validator({ params: idSchema }), deleteUser);
router.post('/', validator({ body: createUserSchema }), postUser);

export default router;
