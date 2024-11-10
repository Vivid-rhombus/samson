import { FastifyInstance } from 'fastify';
import {
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	postUserHandler,
	updateUserHandler,
} from './users.controller';

async function userRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				body: { $ref: '/definitions/createUserSchema#' },
				response: {
					201: { $ref: '/definitions/userSchema#' },
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
					200: { $ref: '/definitions/getUsersResponse#' },
				},
			},
		},
		getUsersHandler
	);

	server.get(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/userIdSchema#' },
				response: {
					200: { $ref: '/definitions/fullUserSchema#' },
				},
			},
		},
		getUserHandler
	);

	server.delete(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/userIdSchema#' },
				response: {
					200: { $ref: '/definitions/userIdSchema#' },
				},
			},
		},
		deleteUserHandler
	);

	server.patch(
		'/:id',
		{
			schema: {
				params: { $ref: '/definitions/userIdSchema#' },
				body: { $ref: '/definitions/updateUserSchema#' },
				response: {
					200: { $ref: '/definitions/userSchema#' },
				},
			},
		},
		updateUserHandler
	);
}

export default userRoutes;
