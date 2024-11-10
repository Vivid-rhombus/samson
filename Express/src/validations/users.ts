import { z } from 'zod';
import { userSchema } from '../db/usersHandler';

export const createUserSchema = userSchema.pick({
	name: true,
	role: true,
});
export const updateUserSchema = userSchema.pick({ role: true });

export const idSchema = z.object({
	id: z.string().uuid(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Id = z.infer<typeof idSchema>;
