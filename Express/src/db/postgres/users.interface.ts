export interface userQueryInterface {
	id?: string;
	name?: string;
	role?: string;
}

export interface userInterface {
	id?: string;
	name?: string;
	role?: string;
	tasks?: object;
	updatedAt?: Date;
	createdAt?: Date;
}
