import { taskInterface } from './tasks.interface';

export interface userQueryInterface {
	id?: string;
	name?: string;
	role?: string;
}

export interface userInterface {
	id?: string;
	name?: string;
	role?: string;
	tasks?: taskInterface[];
	updatedAt?: Date;
	createdAt?: Date;
}
