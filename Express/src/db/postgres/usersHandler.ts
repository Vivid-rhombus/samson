import { randomUUID } from 'crypto';
import { getClient } from './postgresHandler';

import { userQueryInterface, userInterface } from './users.interface';
import { QueryResult } from 'pg';

const whereClauseBuilder = (query: userQueryInterface) => {
	return Object.entries(query)
		.map(([key, val]) => {
			return `${key} = '${val}'`;
		})
		.join(' AND ');
};

export const findOne = async (query: userQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `SELECT * FROM users WHERE ${whereClause}`;
	const result: QueryResult<userInterface> = await getClient().query(sqlQuery);
	return result.rows[0];
};

export const find = async (query: userQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery =
		Object.keys(query).length > 0
			? `SELECT * FROM users WHERE ${whereClause}`
			: `SELECT * FROM users`;
	const result: QueryResult<userInterface> = await getClient().query(sqlQuery);
	return result.rows;
};

export const createOne = async (user: userInterface) => {
	user.id = randomUUID();
	user.createdAt = new Date();
	user.updatedAt = new Date();
	const sqlQuery = `INSERT INTO users(${Object.keys(user).join(
		', '
	)}) VALUES (${Object.keys(user)
		.map((key, index) => `$${index + 1}`)
		.join(', ')})`;
	const result = await getClient().query({
		text: sqlQuery,
		values: Object.values(user),
	});
	return result;
};

export const updateOne = async (
	query: userQueryInterface,
	user: userInterface
) => {
	user.updatedAt = new Date();
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `UPDATE users SET ${Object.keys(user)
		.map((key, index) => {
			return `${key} = $${index + 1}`;
		})
		.join(' , ')} WHERE ${whereClause}`;
	const result = await getClient().query({
		text: sqlQuery,
		values: Object.values(user),
	});
	return result;
};

export const deleteOne = async (query: userQueryInterface) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery = `DELETE FROM users WHERE ${whereClause}`;
	const result = await getClient().query(sqlQuery);
	return result;
};

export const dropUsers = async () => {
	const sqlQuery = `DELETE FROM users`;
	const result = await getClient().query(sqlQuery);
	return result;
};
