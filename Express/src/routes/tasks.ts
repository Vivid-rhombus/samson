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
	completeTask,
	assignTasks,
} from '../handlers/tasks';
import { adminAuth } from '../middleware/authentication';

const router = Router();

router.get('/', getTasks);
router.get('/:id', validate({ params: taskIdSchema }), getTask);
router.patch(
	'/:id',
	validate({ params: taskIdSchema, body: updateTaskSchema }),
	updateTask
);
router.put('/:id/complete', validate({ params: taskIdSchema }), completeTask);
router.delete('/:id', validate({ params: taskIdSchema }), deleteTask);
router.post('/', adminAuth, validate({ body: taskSchema }), postTask);
router.post('/assign', adminAuth, assignTasks);

export default router;
