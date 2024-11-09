import { randomUUID } from 'crypto';
import { getClient } from './postgresHandler';

import { QueryResult } from 'pg';
import { FullUser, User, UserQuery } from '../modules/users/users.schemas';

const whereClauseBuilder = (query: UserQuery) => {
	return Object.entries(query)
		.map(([key, val]) => {
			return `${key} = '${val}'`;
		})
		.join(' AND ');
};

export const findOne = async (query: UserQuery) => {
	const sqlQuery = `
  SELECT 
    users.id
  , users.name
  , users.role
  , users.createdat
  , users.updatedat
  , json_agg(tasks.*) as tasks
  FROM users 
  LEFT JOIN tasks 
  ON users.id = tasks.user_id 
  WHERE tasks.user_id = '${query.id}'
  GROUP BY users.id`;
	const result: QueryResult<FullUser> = await getClient().query(sqlQuery);
	return result.rows[0];
};

export const find = async (query: UserQuery) => {
	const whereClause = whereClauseBuilder(query);
	const sqlQuery =
		Object.keys(query).length > 0
			? `SELECT * FROM users WHERE ${whereClause}`
			: `SELECT * FROM users`;
	const result: QueryResult<User> = await getClient().query(sqlQuery);
	return result.rows;
};

export const createOne = async (user: UserQuery) => {
	user.id = randomUUID();
	user.createdat = new Date().toISOString();
	user.updatedat = new Date().toISOString();
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

export const updateOne = async (query: UserQuery, user: UserQuery) => {
	user.updatedat = new Date().toISOString();
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

export const deleteOne = async (query: UserQuery) => {
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
