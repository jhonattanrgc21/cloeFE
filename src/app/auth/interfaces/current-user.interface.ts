import { User } from "src/app/dashboard/interfaces/users.interface";

export type UserSession = Omit<User, 'id' | 'estado' | 'ciudad'> & {
	user_id: number;
	estado:        number;
	ciudad:     number;
}