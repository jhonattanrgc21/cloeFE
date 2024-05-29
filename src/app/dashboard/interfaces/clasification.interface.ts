export interface Clasification {
    id:           number;
    model:        string;
    brand:        string;
    linea:        string;
    categoria:    string;
    clasificador: string;
    information:  string;
    status:       string;
}

export interface ClasificationRegister {
    brand_id:    number;
    line_id:     number;
    category_id: number;
    model:       string;
    information: string;
}

export type ClasificationEdit = Partial<ClasificationRegister> & {
    id?: number
}