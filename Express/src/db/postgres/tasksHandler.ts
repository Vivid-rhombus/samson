import { getClient } from './postgresHandler';
import { randomUUID } from 'crypto';

import { taskQueryInterface, taskInterface } from './tasks.interface';
import { QueryResult } from 'pg';
import { userInterface } from './users.interface';

const whereClauseBuilder = (query: taskQueryInterface) => {
	return Object.entries(query)
		.map(([key, val]) => {
			return `${key} = '${val}'`;
		})
		.join(' AND ');
};

export const findOne = async (query: taskQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `SELECT * FROM tasks WHERE ${whereClause}`;
	const result: QueryResult<taskInterface> = await getClient().query(sqlQuery);
	return result.rows[0];
};

export const find = async (query: taskQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery =
		Object.keys(query).length > 0
			? `SELECT * FROM tasks WHERE ${whereClause}`
			: `SELECT * FROM tasks`;
	const result: QueryResult<taskInterface> = await getClient().query(sqlQuery);
	return result.rows;
};

export const createOne = async (task: taskInterface) => {
	task.id = randomUUID();
	task.createdAt = new Date();
	task.updatedAt = new Date();
	task.user_id = null;
	const sqlQuery = `INSERT INTO tasks(${Object.keys(task).join(
		', '
	)}) VALUES (${Object.keys(task)
		.map((key, index) => `$${index + 1}`)
		.join(', ')})`;
	const result = await getClient().query({
		text: sqlQuery,
		values: Object.values(task),
	});
	return result;
};

export const updateOne = async (
	query: taskQueryInterface,
	task: taskInterface
) => {
	task.updatedAt = new Date();
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `UPDATE tasks SET ${Object.keys(task)
		.map((key, index) => {
			return `${key} = $${index + 1}`;
		})
		.join(' , ')} WHERE ${whereClause}`;
	const result = await getClient().query({
		text: sqlQuery,
		values: Object.values(task),
	});
	return result;
};

export const deleteOne = async (query: taskQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `DELETE FROM tasks WHERE ${whereClause}`;
	const result = await getClient().query(sqlQuery);
	return result;
};

export const droptasks = async () => {
	const sqlQuery = `DELETE FROM tasks`;
	const result = await getClient().query(sqlQuery);
	return result;
};

export const assignTasks = async () => {
	const userSqlQuery = 'SELECT id FROM users';
	const users: QueryResult<userInterface> = await getClient().query(
		userSqlQuery
	);
	const unassignedTasks: QueryResult<taskInterface> = await getClient().query(
		'SELECT * FROM tasks WHERE user_id IS null'
	);

	const updates = unassignedTasks.rows.map((task) => {
		const randomUserIndex = Math.floor(Math.random() * users.rows.length);
		const randomUser = users.rows[randomUserIndex];
		console.log(randomUser);

		return getClient().query({
			text: 'UPDATE tasks SET user_id = $1 WHERE id = $2 RETURNING *',
			values: [randomUser.id, task.id],
		});
	});

	const results = await Promise.all(updates);

	return results;
};
