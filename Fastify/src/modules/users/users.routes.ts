import { FastifyInstance } from 'fastify';
import {
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	postUserHandler,
	updateUserHandler,
} from './users.controller';
import { $ref } from './users.schemas';
import { assignTasksHandler } from '../tasks/tasks.controller';

async function userRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createUserSchema'),
				response: {
					201: $ref('userSchema'),
				},
			},
		},
		postUserHandler
	);

	server.get(
		'/',
		{
			schema: {
				response: {
					200: $ref('getUsersResponse'),
				},
			},
		},
		getUsersHandler
	);

	server.get(
		'/:id',
		{
			schema: {
				params: $ref('userIdSchema'),
				response: {
					200: $ref('fullUserSchema'),
				},
			},
		},
		getUserHandler
	);

	server.delete(
		'/:id',
		{
			schema: {
				params: $ref('userIdSchema'),
				response: {
					200: $ref('deleteResponse'),
				},
			},
		},
		deleteUserHandler
	);

	server.patch(
		'/:id',
		{
			schema: {
				params: $ref('userIdSchema'),
				body: $ref('updateUserSchema'),
				response: {
					200: $ref('userSchema'),
				},
			},
		},
		assignTasksHandler
	);

	// preHandler: [server.authenticate],
}

export default userRoutes;
