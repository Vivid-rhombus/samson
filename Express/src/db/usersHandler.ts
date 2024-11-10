import { and, eq, SQLWrapper } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { db } from './db';
import { UsersTable } from './schema';

export const findUserById = async (id: string) => {
	const users = await db.query.UsersTable.findMany({
		where: eq(UsersTable.id, id),
		with: {
			tasks: {
				columns: {
					userId: false,
				},
			},
		},
		limit: 1,
	});

	return users[0];
};

export const findUsers = async (...filters: SQLWrapper[]) => {
	const users = await db.query.UsersTable.findMany({
		where: filters.length > 0 ? and(...filters) : undefined,
		limit: 100,
	});

	return users;
};

export const createUser = async (user: UserInsert) => {
	const results = await db
		.insert(UsersTable)
		.values(user)
		.returning({ insertedUser: UsersTable.id });
	return results[0];
};

export const updateUsers = async (
	updateObj: UserUpdate,
	...filters: SQLWrapper[]
) => {
	updateObj.updatedAt = new Date();
	const results = await db
		.update(UsersTable)
		.set(updateObj)
		.where(and(...filters))
		.returning({ updatedId: UsersTable.id });
	return results[0];
};

export const updateUserById = async (id: string, updateObj: UserUpdate) => {
	updateObj.updatedAt = new Date();
	const results = await db
		.update(UsersTable)
		.set(updateObj)
		.where(eq(UsersTable.id, id))
		.returning({ updatedId: UsersTable.id });
	return results[0];
};

export const deleteUserById = async (id: string) => {
	const results = await db
		.delete(UsersTable)
		.where(eq(UsersTable.id, id))
		.returning({ deletedId: UsersTable.id });
	return results[0];
};

export const dropUsersTable = async () => {
	await db.delete(UsersTable);
};

export const userSchema = createSelectSchema(UsersTable);

const insertUserSchema = createInsertSchema(UsersTable);
const partialUserSchema = userSchema.partial();

type UserUpdate = z.infer<typeof partialUserSchema>;
type UserInsert = z.infer<typeof insertUserSchema>;
