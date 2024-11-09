import { Router } from 'express';
import { ExpressJoiInstance, createValidator } from 'express-joi-validation';

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
const validator: ExpressJoiInstance = createValidator();

router.get('/', getUsers);
router.get('/:id', validator.params(userIdSchema), getUser);
router.patch(
	'/:id',
	validator.params(userIdSchema),
	validator.body(updateUserSchema),
	updateUser
);
router.delete('/:id', validator.params(userIdSchema), deleteUser);
router.post('/', validator.body(userSchema), postUser);

export default router;
