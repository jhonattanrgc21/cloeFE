export interface UserRegister {
    name:         string;
    lastname:     string;
    address:      string;
    email:        string;
    role:         string;
    ci_type:      string;
    ci_number:    string;
    estado_id:    number;
    municipio_id: number;
    centro_id:    number;
}

export type UserEdit = Partial<UserRegister> & {
    id?: number;
    active?: number
}

export interface User {
	id:            number;
	name:          string;
	lastname:      string;
	cedula_type:   string;
	cedula_number: string;
	email:         string;
	username:      string;
	estado:        string;
	municipio:     string;
	address:       string;
	active:        number;
	role:          string;
	centro_id:     number;
}