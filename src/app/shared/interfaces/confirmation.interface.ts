type Type = 'edit' | 'delete';

export interface Confirmation {
	icon: string;
	title: string;
	subtitle: string;
	description?: string;
	type: Type;
}