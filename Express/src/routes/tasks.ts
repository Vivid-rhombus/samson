import { Router } from 'express';
import validate from 'express-joi-validations';

import {
	taskSchema,
	updateTaskSchema,
	taskIdSchema,
} from '../validations/tasks';
import {
	getTask,
	getTasks,
	postTask,
	updateTask,
	deleteTask,
} from '../handlers/tasks';
import { adminAuth } from '../middleware/authentication';

const router = Router();

router.get('/', getTasks);
router.get('/:id', validate({ params: taskIdSchema }), getTask);
router.put(
	'/:id',
	validate({ params: taskIdSchema, body: updateTaskSchema }),
	updateTask
);
router.delete('/:id', validate({ params: taskIdSchema }), deleteTask);
router.post('/', adminAuth, validate({ body: taskSchema }), postTask);

export default router;
