export interface taskQueryInterface {
	id?: string;
	name?: string;
	completion?: boolean;
}

export interface taskInterface {
	id?: string;
	name?: string;
	description?: string;
	user_id?: string | null;
	completion?: boolean;
	completionDate?: Date;
	updatedAt?: Date;
	createdAt?: Date;
}
