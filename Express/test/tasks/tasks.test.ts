import { Express } from 'express';
import request, { Response } from 'supertest';
import jwt from 'jsonwebtoken';

import { loadApp } from '../../src/server';
import { taskInterface } from '../../src/db/postgres/tasks.interface';
import { randomUUID } from 'crypto';
import {
	createTask,
	dropTasksTable,
	findTasks,
} from '../../src/db/tasksHandler';

let app: Express;
dropTasksTable;
describe('Test /tasks endpoints', () => {
	beforeAll(async () => {
		app = await loadApp();
		await dropTasksTable();
	});

	beforeEach(async () => {
		await createTask({ name: 'abc', description: 'aaa' });
		await createTask({ name: 'xyz', description: 'bbb' });
	});

	afterEach(async () => {
		await dropTasksTable();
	});

	describe('GET /tasks', () => {
		it('Should get all tasks', async () => {
			const response: Response = await request(app).get('/tasks');
			expect(response.body.length).toBe(2);
			expect(response.body).toMatchObject([
				{ name: 'abc', description: 'aaa' },
				{ name: 'xyz', description: 'bbb' },
			]);
		});

		it('Should fail to get all tasks', async () => {
			await dropTasksTable();
			const response: Response = await request(app).get(`/tasks`);
			expect(response.status).toBe(404);
		});

		it('Should get a specific task', async () => {
			const users = await findTasks();
			const { id } = users[0];
			const response: Response = await request(app).get(`/tasks/${id}`);
			expect(response.body).toMatchObject({
				name: users[0].name,
				description: users[0].description,
			});
		});

		it('Should fail to get a specific task', async () => {
			const response: Response = await request(app).get(
				`/tasks/${randomUUID()}`
			);
			expect(response.status).toBe(404);
		});
	});

	describe('POST /tasks', () => {
		it('Should create a task', async () => {
			const token: string = jwt.sign({ role: 'admin' }, 'secret');
			const response: Response = await request(app)
				.post(`/tasks`)
				.auth(token, { type: 'bearer' })
				.send({
					name: 'efg',
					description: 'user',
				});
			const tasks = await findTasks();
			expect(response.status).toBe(200);
			expect(tasks.length).toBe(3);
			expect(tasks).toMatchObject([
				{ name: 'abc', description: 'aaa' },
				{ name: 'xyz', description: 'bbb' },
				{
					name: 'efg',
					description: 'user',
				},
			]);
		});

		it('Should fail to create a task because of bad token', async () => {
			const token: string = jwt.sign({ data: { role: 'user' } }, 'secret');
			const response: Response = await request(app)
				.post(`/tasks`)
				.auth(token, { type: 'bearer' })
				.send({
					name: 'efg',
				});
			expect(response.status).toBe(403);
		});

		it('Should fail to create a task because of no token', async () => {
			const response: Response = await request(app).post(`/tasks`).send({
				name: 'efg',
			});
			expect(response.status).toBe(401);
		});

		it('Should fail to create a task because of schema', async () => {
			const token: string = jwt.sign({ role: 'admin' }, 'secret');
			const response: Response = await request(app)
				.post(`/tasks`)
				.auth(token, { type: 'bearer' })
				.send({
					name: 'efg',
				});
			expect(response.status).toBe(400);
		});
	});

	it('Should delete a task', async () => {
		let users = await findTasks();
		const { id } = users[0];
		await request(app).delete(`/tasks/${id}`);
		users = await findTasks();
		expect(users.length).toBe(1);
		expect(users[0].id).not.toBe(id);
	});

	it('Should patch a task', async () => {
		let tasks = await findTasks();
		const task = tasks.find((task) => {
			return task.name === 'abc';
		});
		await request(app).patch(`/tasks/${task?.id}`).send({ name: 'efg' });
		tasks = await findTasks();
		expect(tasks).toMatchObject([
			{ name: 'xyz', description: 'bbb' },
			{ name: 'efg', description: 'aaa' },
		]);
	});

	it('Should complete a task', async () => {
		let tasks = await findTasks();
		const task = tasks.find((task) => {
			return task.name === 'abc';
		});
		await request(app).put(`/tasks/${task?.id}/complete`).send();
		tasks = await findTasks();
		expect(tasks).toMatchObject([
			{ name: 'xyz', description: 'bbb' },
			{ name: 'abc', description: 'aaa', completed: true },
		]);
	});
});
