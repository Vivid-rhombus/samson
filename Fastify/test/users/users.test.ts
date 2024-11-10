import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import buildServer from '../../src/server';
import { createTask, dropTasksTable } from '../../src/db/tasksHandler';
import {
	createUser,
	dropUsersTable,
	findUsers,
} from '../../src/db/usersHandler';
import { FullUser } from '../../src/modules/users/users.schemas';

let app: FastifyInstance = buildServer();

describe('Test /users endpoints', () => {
	beforeAll(async () => {
		await dropUsersTable();
	});

	beforeEach(async () => {
		await createUser({ name: 'abc', role: 'admin' });
		await createUser({ name: 'xyz', role: 'user' });
	});

	afterEach(async () => {
		await dropUsersTable();
	});

	describe('GET /users', () => {
		it('Should get all users', async () => {
			const response = await app.inject().get('/users');
			expect(response.json().length).toBe(2);
			expect(response.json()).toMatchObject([
				{ name: 'abc', role: 'admin' },
				{ name: 'xyz', role: 'user' },
			]);
		});

		it('Should fail to get all users', async () => {
			await dropUsersTable();
			const response = await app.inject().get(`/users`);
			expect(response.statusCode).toBe(404);
		});

		it('Should get a specific user', async () => {
			const users = await findUsers();
			const { id } = users[0];
			await createTask({ name: 'a', description: 'abc', userId: id });
			const response = await app.inject().get(`/users/${id}`);
			const { tasks } = response.json() as FullUser;
			expect(response.json()).toMatchObject({ name: 'abc', role: 'admin' });
			expect(tasks?.length).toBe(1);
			await dropTasksTable();
		});

		it('Should fail to get a specific user', async () => {
			const response = await app.inject().get(`/users/${randomUUID()}`);
			expect(response.statusCode).toBe(404);
		});
	});

	describe('POST /users', () => {
		it('Should create a user', async () => {
			await app.inject().post(`/users`).body({
				name: 'efg',
				role: 'user',
			});
			const users = await findUsers();
			expect(users.length).toBe(3);
			expect(users).toMatchObject([
				{ name: 'abc', role: 'admin' },
				{ name: 'xyz', role: 'user' },
				{
					name: 'efg',
					role: 'user',
				},
			]);
		});

		it('Should fail to create a user', async () => {
			const response = await app.inject().post(`/users`).body({
				name: 'efg',
			});
			expect(response.statusCode).toBe(400);
		});
	});

	it('Should delete a user', async () => {
		let users = await findUsers();
		const { id } = users[0];
		await app.inject().delete(`/users/${id}`);
		users = await findUsers();
		expect(users.length).toBe(1);
		expect(users[0].id).not.toBe(id);
	});

	it('Should patch a user', async () => {
		let users = await findUsers();
		const user = users.find((user) => {
			return user.role === 'user';
		});
		await app.inject().patch(`/users/${user?.id}`).body({ role: 'admin' });
		users = await findUsers();
		expect(users).toMatchObject([
			{ name: 'abc', role: 'admin' },
			{ name: 'xyz', role: 'admin' },
		]);
	});
});
