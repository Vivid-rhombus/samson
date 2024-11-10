import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import buildServer from '../../src/server';
import {
	createTask,
	dropTasksTable,
	findTasks,
} from '../../src/db/tasksHandler';

let app: FastifyInstance = buildServer();

describe('Test /tasks endpoints', () => {
	beforeAll(async () => {
		app = buildServer();
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
			const response = await app.inject().get('/tasks');
			expect(response.json().length).toBe(2);
			expect(response.json()).toMatchObject([
				{ name: 'abc', description: 'aaa' },
				{ name: 'xyz', description: 'bbb' },
			]);
		});

		it('Should fail to get all tasks', async () => {
			await dropTasksTable();
			const response = await app.inject().get(`/tasks`);
			expect(response.statusCode).toBe(404);
		});

		it('Should get a specific task', async () => {
			const users = await findTasks();
			const { id } = users[0];
			const response = await app.inject().get(`/tasks/${id}`);
			expect(response.json()).toMatchObject({
				name: users[0].name,
				description: users[0].description,
			});
		});

		it('Should fail to get a specific task', async () => {
			const response = await app.inject().get(`/tasks/${randomUUID()}`);
			expect(response.statusCode).toBe(404);
		});
	});

	describe('POST /tasks', () => {
		it('Should create a task', async () => {
			const token: string = jwt.sign({ role: 'admin' }, 'secret');
			const response = await app
				.inject()
				.post(`/tasks`)
				.headers({ authorization: `Bearer ${token}` })
				.body({
					name: 'efg',
					description: 'user',
				});
			const tasks = await findTasks();
			expect(response.statusCode).toBe(201);
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
			const response = await app
				.inject()
				.post(`/tasks`)
				.headers({ authorization: `Bearer ${token}` })
				.body({
					name: 'efg',
					description: 'user',
				});
			expect(response.statusCode).toBe(403);
		});

		it('Should fail to create a task because of no token', async () => {
			const response = await app.inject().post(`/tasks`).body({
				name: 'efg',
				description: 'user',
			});
			expect(response.statusCode).toBe(401);
		});

		it('Should fail to create a task because of schema', async () => {
			const token: string = jwt.sign({ role: 'admin' }, 'secret');
			const response = await app
				.inject()
				.post(`/tasks`)
				.headers({ authorization: `Bearer ${token}` })
				.body({
					name: 'efg',
				});
			expect(response.statusCode).toBe(400);
		});
	});

	it('Should delete a task', async () => {
		let users = await findTasks();
		const { id } = users[0];
		await app.inject().delete(`/tasks/${id}`);
		users = await findTasks();
		expect(users.length).toBe(1);
		expect(users[0].id).not.toBe(id);
	});

	it('Should patch a task', async () => {
		let tasks = await findTasks();
		const task = tasks.find((task) => {
			return task.name === 'abc';
		});
		await app.inject().patch(`/tasks/${task?.id}`).body({ name: 'efg' });
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
		const response = await app.inject().put(`/tasks/${task?.id}/complete`);
		tasks = await findTasks();
		expect(tasks).toMatchObject([
			{ name: 'xyz', description: 'bbb' },
			{ name: 'abc', description: 'aaa', completed: true },
		]);
	});
});
