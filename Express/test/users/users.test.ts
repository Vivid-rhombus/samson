import { Express } from 'express';
import request, { Response } from 'supertest';

import { loadApp } from '../../src/server';
import { createOne, dropUsers, find } from '../../src/db/postgres/usersHandler';
import { createOne as createTask } from '../../src/db/postgres/tasksHandler';
import { userInterface } from '../../src/db/postgres/users.interface';
import { randomUUID } from 'crypto';

let app: Express;

describe('Test /users endpoints', () => {
	beforeAll(async () => {
		app = await loadApp();
		await dropUsers();
	});

	beforeEach(async () => {
		await createOne({ name: 'abc', role: 'admin' });
		await createOne({ name: 'xyz', role: 'user' });
	});

	afterEach(async () => {
		await dropUsers();
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
			await dropUsers();
			const response: Response = await request(app).get(`/users`);
			expect(response.status).toBe(404);
		});

		it('Should get a specific user', async () => {
			const users: userInterface[] = await find({});
			const { id } = users[0];
			await createTask({ name: 'a', description: 'abc', user_id: id });
			const response: Response = await request(app).get(`/users/${id}`);
			const { tasks } = response.body as userInterface;
			expect(response.body).toMatchObject({ name: 'abc', role: 'admin' });
			expect(tasks?.length).toBe(1);
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
			const users: userInterface[] = await find({});
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
		let users: userInterface[] = await find({});
		const { id } = users[0];
		await request(app).delete(`/users/${id}`);
		users = await find({});
		expect(users.length).toBe(1);
		expect(users[0].id).not.toBe(id);
	});

	it('Should patch a user', async () => {
		let users: userInterface[] = await find({});
		const user: userInterface | undefined = users.find(
			(user: userInterface) => {
				return user.role === 'user';
			}
		);
		await request(app).patch(`/users/${user?.id}`).send({ role: 'admin' });
		users = await find({});
		expect(users).toMatchObject([
			{ name: 'abc', role: 'admin' },
			{ name: 'xyz', role: 'admin' },
		]);
	});
});
