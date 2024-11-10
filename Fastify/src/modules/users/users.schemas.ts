import { array, z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { userSchema } from '../../db/usersHandler';
import { taskSchema } from '../../db/tasksHandler';

const createUserSchema = userSchema.pick({ name: true, role: true });

const updateUserSchema = userSchema.pick({ role: true });

const userIdSchema = z.object({
	id: z.string().uuid(),
});

const fullUserSchema = userSchema.extend({
	tasks: array(taskSchema.omit({ userId: true })),
});

const getUsersResponse = z.array(userSchema);

const userQuerySchema = userSchema.partial();

export type User = z.infer<typeof userSchema>;
export type FullUser = z.infer<typeof fullUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdSchema>;
export type UserUpdateInput = z.infer<typeof updateUserSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;

// export const { schemas: userSchemas, $ref } =
export const userSchemas = {
	createUserSchema: zodToJsonSchema(createUserSchema),
	updateUserSchema: zodToJsonSchema(updateUserSchema),
	userIdSchema: zodToJsonSchema(userIdSchema),
	fullUserSchema: zodToJsonSchema(fullUserSchema),
	getUsersResponse: zodToJsonSchema(getUsersResponse),
	userSchema: zodToJsonSchema(userSchema),
};
