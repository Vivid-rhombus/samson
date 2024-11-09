import { FastifyInstance } from 'fastify';
import {
	completeTaskHandler,
	deleteTaskHandler,
	getTaskHandler,
	getTasksHandler,
	postTaskHandler,
	updateTaskHandler,
} from './tasks.controller';

async function taskRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				body: { $ref: '/definitions/createTaskSchema#' },
				response: {
					201: { $ref: '/definitions/taskSchema#' },
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
					200: { $ref: '/definitions/getTasksResponse#' },
				},
			},
		},
		getTasksHandler
	);

	server.get(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/taskIdSchema#' },
				response: {
					200: { $ref: '/definitions/taskSchema#' },
				},
			},
		},
		getTaskHandler
	);

	server.delete(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/taskIdSchema#' },
				response: {
					200: { $ref: '/definitions/taskIdSchema#' },
				},
			},
		},
		deleteTaskHandler
	);

	server.patch(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/taskIdSchema#' },
				body: { $ref: '/definitions/updateTaskSchema#' },
				response: {
					200: { $ref: '/definitions/taskSchema#' },
				},
			},
		},
		updateTaskHandler
	);

	server.put(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/taskIdSchema#' },
				response: {
					200: { $ref: '/definitions/taskSchema#' },
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
				params: { $ref: '/definitions/taskIdSchema#' },
				response: {
					200: { $ref: '/definitions/deleteResponse#' },
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
					200: { $ref: '/definitions/taskSchema#' },
				},
			},
		},
		updateTaskHandler
	);
}

export default taskRoutes;
