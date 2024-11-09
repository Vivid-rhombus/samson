import { taskInterface } from '../db/postgres/tasks.interface';
import * as pgTaskHandler from '../db/postgres/tasksHandler';

import { Request, Response } from 'express';

export const getTasks = async (req: Request, res: Response) => {
	try {
		console.log('Fetching tasks');
		const tasks = await pgTaskHandler.find({});
		if (tasks.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.send(tasks);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching tasks, error: ${err}`);
	}
};

export const getTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		console.log(`Fetching task with id ${id}`);
		const tasks = await pgTaskHandler.findOne({ id });
		if (!tasks) {
			res.sendStatus(404);
			return;
		}
		res.send(tasks);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching task, error: ${err}`);
	}
};

export const postTask = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;
		console.log(`Adding task`);
		await pgTaskHandler.createOne({ name, description });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error adding task, error: ${err}`);
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;
		const { id } = req.params;
		console.log(`Updating task with id ${id}`);
		await pgTaskHandler.updateOne({ id: id }, { name, description });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error updating task, error: ${err}`);
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		console.log(`Deleting task with id ${id}`);
		await pgTaskHandler.deleteOne({ id: id });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error deleting task, error: ${err}`);
	}
};
