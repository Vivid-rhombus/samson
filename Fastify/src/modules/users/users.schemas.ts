import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { taskSchema } from '../tasks/tasks.schemas';

const createUserSchema = z.object({
	name: z.string(),
	role: z.enum(['admin', 'user']),
});

const updateUserSchema = z.object({
	role: z.enum(['admin', 'user']),
});

const userIdSchema = z.object({
	id: z.string().uuid(),
});

const userCore = {
	name: z.string(),
	role: z.enum(['admin', 'user']),
	createdat: z.string().datetime({ offset: true }),
	updatedat: z.string().datetime({ offset: true }),
};

const userSchema = z.object({
	...userCore,
	id: z.string().uuid(),
});

const fullUserSchema = z.object({
	...userCore,
	id: z.string().uuid(),
	tasks: z.array(taskSchema),
});

const getUsersResponse = z.array(userSchema);

const userQuerySchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().optional(),
	role: z.enum(['admin', 'user']).optional(),
	createdat: z.string().datetime({ offset: true }).optional(),
	updatedat: z.string().datetime({ offset: true }).optional(),
});

const deleteResponse = z.object({
	id: z.string().uuid(),
});

export type User = z.infer<typeof userSchema>;
export type FullUser = z.infer<typeof fullUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdSchema>;
export type UserUpdateInput = z.infer<typeof updateUserSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
	{
		createUserSchema,
		updateUserSchema,
		userIdSchema,
		fullUserSchema,
		getUsersResponse,
		userSchema,
		deleteResponse,
	},
	{ $id: 'userSchemas' }
);
