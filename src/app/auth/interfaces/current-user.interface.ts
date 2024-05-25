import { User } from "src/app/dashboard/interfaces/users.interface";

export type UserSession = Omit<User, 'id' | 'estado' | 'municipio'> & {
	user_id: number;
	estado:        number;
	municipio:     number;
}