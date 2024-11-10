import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

import { taskSchema } from '../../db/tasksHandler';

const createTaskSchema = taskSchema.pick({ name: true, description: true });

const updateTaskSchema = createTaskSchema.partial();

const taskIdSchema = z.object({
	id: z.string().uuid(),
});

const getTasksResponse = z.array(taskSchema);

const taskQuerySchema = taskSchema.partial();

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskIdParamInput = z.infer<typeof taskIdSchema>;
export type TaskUpdateInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;

export const taskSchemas = {
	createTaskSchema: zodToJsonSchema(createTaskSchema),
	updateTaskSchema: zodToJsonSchema(updateTaskSchema),
	taskIdSchema: zodToJsonSchema(taskIdSchema),
	getTasksResponse: zodToJsonSchema(getTasksResponse),
	taskSchema: zodToJsonSchema(taskSchema),
};
