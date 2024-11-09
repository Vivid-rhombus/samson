import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const createTaskSchema = z.object({
	name: z.string(),
	description: z.string(),
});

const updateTaskSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
});

const taskIdSchema = z.object({
	id: z.string().uuid(),
});

const taskCoreSchema = {
	name: z.string(),
	description: z.string(),
	completed: z.boolean(),
	completiondate: z.string().datetime({ offset: true }).nullable(),
	user_id: z.string().uuid().nullable(),
	createdat: z.string().datetime({ offset: true }),
	updatedat: z.string().datetime({ offset: true }),
};

export const taskSchema = z.object({
	...taskCoreSchema,
	id: z.string().uuid(),
});

const getTasksResponse = z.array(taskSchema);

const taskQuerySchema = z.object({
	id: z.string().uuid().optional(),
	completed: z.boolean().optional(),
	completiondate: z.string().datetime({ offset: true }).nullable().optional(),
	user_id: z.string().uuid().nullable().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	createdat: z.string().datetime({ offset: true }).optional(),
	updatedat: z.string().datetime({ offset: true }).optional(),
});

const deleteResponse = z.object({
	id: z.string().uuid(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskIdParamInput = z.infer<typeof taskIdSchema>;
export type TaskUpdateInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;

export const { schemas: taskSchemas, $ref } = buildJsonSchemas(
	{
		createTaskSchema,
		updateTaskSchema,
		taskIdSchema,
		getTasksResponse,
		taskSchema,
		deleteResponse,
	},
	{ $id: 'taskSchemas' }
);
