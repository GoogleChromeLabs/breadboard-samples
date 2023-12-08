// domain
export type User = {
	id: string;
	name: string;
	email: string;
	displayName: string;
}

// data types

export type UserCreateRequest = {
	name: string;
	email: string;
}