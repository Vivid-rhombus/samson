import { Express } from 'express';
import request, { Response } from 'supertest';

import { loadApp } from '../../src/server';
import { userInterface } from '../../src/db/postgres/users.interface';
import { randomUUID } from 'crypto';
import { createTask, dropTasksTable } from '../../src/db/tasksHandler';
import {
	createUser,
	dropUsersTable,
	findUsers,
} from '../../src/db/usersHandler';

let app: Express;

describe('Test /users endpoints', () => {
	beforeAll(async () => {
		app = await loadApp();
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
			const response: Response = await request(app).get('/users');
			expect(response.body.length).toBe(2);
			expect(response.body).toMatchObject([
				{ name: 'abc', role: 'admin' },
				{ name: 'xyz', role: 'user' },
			]);
		});

		it('Should fail to get all users', async () => {
			await dropUsersTable();
			const response: Response = await request(app).get(`/users`);
			expect(response.status).toBe(404);
		});

		it('Should get a specific user', async () => {
			const users = await findUsers();
			const { id } = users[0];
			await createTask({ name: 'a', description: 'abc', userId: id });
			const response: Response = await request(app).get(`/users/${id}`);
			const { tasks } = response.body as userInterface;
			expect(response.body).toMatchObject({ name: 'abc', role: 'admin' });
			expect(tasks?.length).toBe(1);
			await dropTasksTable();
		});

		it('Should fail to get a specific user', async () => {
			const response: Response = await request(app).get(
				`/users/${randomUUID()}`
			);
			expect(response.status).toBe(404);
		});
	});

	describe('POST /users', () => {
		it('Should create a user', async () => {
			await request(app).post(`/users`).send({
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
			const response: Response = await request(app).post(`/users`).send({
				name: 'efg',
			});
			expect(response.status).toBe(400);
		});
	});

	it('Should delete a user', async () => {
		let users = await findUsers();
		const { id } = users[0];
		await request(app).delete(`/users/${id}`);
		users = await findUsers();
		expect(users.length).toBe(1);
		expect(users[0].id).not.toBe(id);
	});

	it('Should patch a user', async () => {
		let users = await findUsers();
		const user = users.find((user) => {
			return user.role === 'user';
		});
		await request(app).patch(`/users/${user?.id}`).send({ role: 'admin' });
		users = await findUsers();
		expect(users).toMatchObject([
			{ name: 'abc', role: 'admin' },
			{ name: 'xyz', role: 'admin' },
		]);
	});
});
