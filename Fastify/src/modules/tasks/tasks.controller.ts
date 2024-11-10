import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateTaskInput,
	TaskIdParamInput,
	TaskUpdateInput,
} from './tasks.schemas';
import {
	assignTasks,
	createTask,
	deleteTaskById,
	findTasks,
	findTaskById,
	updateTaskById,
} from '../../db/tasksHandler';

export async function postTaskHandler(
	request: FastifyRequest<{
		Body: CreateTaskInput;
	}>,
	reply: FastifyReply
) {
	const body = request.body;

	try {
		const task = await createTask(body);

		return reply.code(201).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const tasks = await findTasks();
		if (tasks.length === 0) return reply.code(404).send();
		return reply.code(200).send(tasks);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await findTaskById(id);
		if (!task) return reply.code(404).send();
		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function deleteTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await deleteTaskById(id);

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function updateTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput; Body: TaskUpdateInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const body = request.body;
		const task = await updateTaskById(id, body);

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function completeTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await updateTaskById(id, {
			completed: true,
			completedAt: new Date(),
		});

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function assignTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		console.log(request.user);
		await assignTasks();

		return reply.code(200).send('done');
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}
