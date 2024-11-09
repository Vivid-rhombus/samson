import { Request, Response } from 'express';

import * as pgUserHandler from '../db/postgres/usersHandler';

export const getUsers = async (req: Request, res: Response) => {
	try {
		console.log('Fetching users');
		const users = await pgUserHandler.find({});
		if (users.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.send(users);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching users, error: ${err}`);
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		console.log(`Fetching user with id ${id}`);
		const users = await pgUserHandler.findOne({ id: id });
		if (!users) {
			res.sendStatus(404);
			return;
		}
		res.send(users);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching user, error: ${err}`);
	}
};

export const postUser = async (req: Request, res: Response) => {
	try {
		const { name, role } = req.body;
		console.log(`Adding user`);
		await pgUserHandler.createOne({ name, role, tasks: [] });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error adding user, error: ${err}`);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { role } = req.body;
		const { id } = req.params;
		console.log(`Updating user with id ${id}`);
		await pgUserHandler.updateOne({ id: id }, { role });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error updating user, error: ${err}`);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		console.log(`Deleting user with id ${id}`);
		await pgUserHandler.deleteOne({ id: id });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error deleting user, error: ${err}`);
	}
};
