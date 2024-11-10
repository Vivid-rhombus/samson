import { z } from 'zod';
import { taskSchema } from '../db/tasksHandler';

export const createTaskSchema = taskSchema.pick({
	name: true,
	description: true,
});
export const updateTaskSchema = createTaskSchema.partial();
export const idSchema = z.object({
	id: z.string().uuid(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
