import { Router } from 'express';
import { ExpressJoiInstance, createValidator } from 'express-joi-validation';

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
const validator: ExpressJoiInstance = createValidator();

router.get('/', getTasks);
router.get('/:id', validator.params(taskIdSchema), getTask);
router.patch(
	'/:id',
	validator.params(taskIdSchema),
	validator.body(updateTaskSchema),
	updateTask
);
router.put('/:id/complete', validator.params(taskIdSchema), completeTask);
router.delete('/:id', validator.params(taskIdSchema), deleteTask);
router.post('/', adminAuth, validator.body(taskSchema), postTask);
router.post('/assign', adminAuth, assignTasks);

export default router;
