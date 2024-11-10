import { Router } from 'express';
import validator from '../middleware/validationMiddleware';

import {
	getTask,
	getTasks,
	postTask,
	updateTask,
	deleteTask,
	completeTask,
	assignTasks,
} from '../handlers/tasks';
import auth, { adminAuth } from '../middleware/authentication';

import {
	createTaskSchema,
	idSchema,
	updateTaskSchema,
} from '../validations/tasks';

const router = Router();
// const validator: ExpressJoiInstance = createValidator();

router.get('/', getTasks);
router.get('/:id', validator({ params: idSchema }), getTask);
router.patch(
	'/:id',
	validator({ params: idSchema, body: updateTaskSchema }),
	updateTask
);
router.put('/:id/complete', validator({ params: idSchema }), completeTask);
router.delete('/:id', validator({ params: idSchema }), deleteTask);
router.post(
	'/',
	auth({ predicate: (payload) => payload.role === 'admin' }),
	validator({ body: createTaskSchema }),
	postTask
);
router.post(
	'/assign',
	auth({ predicate: (payload) => payload.role === 'admin' }),
	assignTasks
);

export default router;
