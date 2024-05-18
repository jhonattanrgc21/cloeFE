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

// export interface UserEdit {
//     id?: number;
//     name:         string;
//     lastname:     string;
//     address:      string;
//     email:        string;
//     role:         string;
//     ci_type:      string;
//     ci_number:    string;
//     estado_id:    number;
//     municipio_id: number;
//     centro_id:    number;
//     active?:   number;
// }

export interface User {
    id:        number;
    name:      string;
    lastname:  string;
    cedula:    string;
    email:     string;
    username:  string;
    estado:    string;
    municipio: string;
    address:   string;
    active:   number;
}
