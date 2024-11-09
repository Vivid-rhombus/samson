import { FastifyInstance } from 'fastify';
import {
	completeTaskHandler,
	deleteTaskHandler,
	getTaskHandler,
	getTasksHandler,
	postTaskHandler,
	updateTaskHandler,
} from './tasks.controller';
import { $ref } from './tasks.schemas';

async function taskRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createTaskSchema'),
				response: {
					201: $ref('taskSchema'),
				},
			},
		},
		postTaskHandler
	);

	server.get(
		'/',
		{
			schema: {
				response: {
					200: $ref('getTasksResponse'),
				},
			},
		},
		getTasksHandler
	);

	server.get(
		'/:id',
		{
			schema: {
				params: $ref('taskIdSchema'),
				response: {
					200: $ref('taskSchema'),
				},
			},
		},
		getTaskHandler
	);

	server.delete(
		'/:id',
		{
			schema: {
				params: $ref('taskIdSchema'),
				response: {
					200: $ref('taskIdSchema'),
				},
			},
		},
		deleteTaskHandler
	);

	server.patch(
		'/:id',
		{
			schema: {
				params: $ref('taskIdSchema'),
				body: $ref('updateTaskSchema'),
				response: {
					200: $ref('taskSchema'),
				},
			},
		},
		updateTaskHandler
	);

	server.put(
		'/:id',
		{
			schema: {
				params: $ref('taskIdSchema'),
				response: {
					200: $ref('taskSchema'),
				},
			},
		},
		updateTaskHandler
	);

	server.put(
		'/:id/complete',
		{
			// preHandler: [server.authenticate],
			schema: {
				params: $ref('taskIdSchema'),
				response: {
					200: $ref('deleteResponse'),
				},
			},
		},
		completeTaskHandler
	);

	server.put(
		'/',
		{
			// preHandler: [server.authenticate],
			schema: {
				response: {
					200: $ref('taskSchema'),
				},
			},
		},
		updateTaskHandler
	);
}

export default taskRoutes;
