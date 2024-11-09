import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fjwt, { JWT } from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
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

	for (const [key, schema] of Object.entries(userSchemas)) {
		server.addSchema({
			$id: `/definitions/${key}`,
			...schema,
		});
	}

	for (const [key, schema] of Object.entries(taskSchemas)) {
		server.addSchema({
			$id: `/definitions/${key}`,
			...schema,
		});
	}

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
	// definitions: { ...userSchemas, ...taskSchemas }
	server.register(swagger, {
		openapi: {
			openapi: '3.0.0',
			info: {
				title: 'Test swagger',
				description: 'Testing the Fastify swagger API',
				version: '0.1.0',
			},
			servers: [
				{
					url: 'http://localhost:3000',
					description: 'Development server',
				},
			],
			tags: [
				{ name: 'user', description: 'User related end-points' },
				{ name: 'code', description: 'Code related end-points' },
			],
			components: {
				securitySchemes: {
					apiKey: {
						type: 'apiKey',
						name: 'apiKey',
						in: 'header',
					},
				},
			},
			externalDocs: {
				url: 'https://swagger.io',
				description: 'Find more info here',
			},
		},
	});

	server.register(swaggerUI, {
		routePrefix: '/documentation',
	});

	server.register(userRoutes, { prefix: 'api/users' });
	server.register(taskRoutes, { prefix: 'api/tasks' });

	return server;
}

export default buildServer;
