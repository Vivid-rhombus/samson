import { and, eq, is, isNull, SQLWrapper } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { db } from './db';
import { TasksTable, UsersTable } from './schema';

export const findTaskById = async (id: string) => {
	const tasks = await db.query.TasksTable.findMany({
		where: eq(TasksTable.id, id),
		limit: 1,
	});

	return tasks[0];
};

export const findTasks = async (...filters: SQLWrapper[]) => {
	const tasks = await db.query.TasksTable.findMany({
		where: filters.length > 0 ? and(...filters) : undefined,
		limit: 100,
	});

	return tasks;
};

export const createTask = async (task: TaskInsert) => {
	const results = await db
		.insert(TasksTable)
		.values(task)
		.returning({ insertedTask: TasksTable.id });
	return results[0];
};

export const updateTasks = async (
	updateObj: TaskUpdate,
	...filters: SQLWrapper[]
) => {
	updateObj.updatedAt = new Date();
	const results = await db
		.update(TasksTable)
		.set(updateObj)
		.where(and(...filters))
		.returning({ updatedId: TasksTable.id });
	return results[0];
};

export const updateTaskById = async (id: string, updateObj: TaskUpdate) => {
	updateObj.updatedAt = new Date();
	const results = await db
		.update(TasksTable)
		.set(updateObj)
		.where(eq(TasksTable.id, id))
		.returning({ updatedId: TasksTable.id });
	return results[0];
};

export const deleteTaskById = async (id: string) => {
	const results = await db
		.delete(TasksTable)
		.where(eq(TasksTable.id, id))
		.returning({ deletedId: TasksTable.id });
	return results[0];
};

export const dropTasksTable = async () => {
	await db.delete(TasksTable);
};

export const assignTasks = async () => {
	const users = await db.select({ id: UsersTable.id }).from(UsersTable);

	const unassignedTasks = await db
		.select({
			id: TasksTable.id,
		})
		.from(TasksTable)
		.where(isNull(TasksTable.userId));

	const updates = unassignedTasks.map((task) => {
		const randomUserIndex = Math.floor(Math.random() * users.length);
		const randomUser = users[randomUserIndex];
		console.log(randomUser);

		return db
			.update(TasksTable)
			.set({ userId: randomUser.id })
			.where(eq(TasksTable.id, task.id));
	});

	await Promise.all(updates);

	return;
};

export const taskSchema = createSelectSchema(TasksTable);

const insertTaskSchema = createInsertSchema(TasksTable);
const partialTaskSchema = taskSchema.partial();

type TaskUpdate = z.infer<typeof partialTaskSchema>;
type TaskInsert = z.infer<typeof insertTaskSchema>;
