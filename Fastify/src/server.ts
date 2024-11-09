import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fjwt, { JWT } from '@fastify/jwt';
import swagger from '@fastify/swagger';
import { withRefResolver } from 'fastify-zod';
import userRoutes from './modules/users/users.routes';
import taskRoutes from './modules/tasks/tasks.routes';
import { userSchemas } from './modules/users/users.schemas';
import { taskSchemas } from './modules/tasks/tasks.schemas';
import { version } from '../package.json';

declare module 'fastify' {
	interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		authenticate: any;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		data: {
			role: string;
		};
	}
}

function buildServer() {
	const server = Fastify();

	server.register(fjwt, {
		secret: 'secret',
	});

	server.decorate(
		'authenticate',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (e) {
				return reply.send(e);
			}
		}
	);

	server.get('/healthcheck', async function () {
		return { status: 'OK' };
	});

	server.addHook('preHandler', (req, reply, next) => {
		req.jwt = server.jwt;
		return next();
	});

	for (const schema of [...userSchemas, ...taskSchemas]) {
		server.addSchema(schema);
	}
	server.register(
		swagger,
		withRefResolver({
			openapi: {
				info: {
					title: 'Fastify API',
					description: 'API for some products',
					version,
				},
			},
		})
	);

	server.register(userRoutes, { prefix: 'api/users' });
	server.register(taskRoutes, { prefix: 'api/tasks' });

	return server;
}

export default buildServer;
