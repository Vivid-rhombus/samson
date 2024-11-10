import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateUserInput,
	UserIdParamInput,
	UserUpdateInput,
} from './users.schemas';
import {
	createUser,
	deleteUserById,
	findUsers,
	findUserById,
	updateUserById,
} from '../../db/usersHandler';

export async function postUserHandler(
	request: FastifyRequest<{
		Body: CreateUserInput;
	}>,
	reply: FastifyReply
) {
	console.log('hi');
	const body = request.body;

	try {
		const user = await createUser(body);
		console.log(user);
		return reply.code(201).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getUsersHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const users = await findUsers();
		if (users.length === 0) return reply.code(404).send();
		return reply.code(200).send(users);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const user = await findUserById(id);
		if (!user) return reply.code(404).send();
		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function deleteUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const user = await deleteUserById(id);

		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function updateUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput; Body: UserUpdateInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const body = request.body;
		const user = await updateUserById(id, body);

		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}
