
export interface IUsuarioModel{
    usuario: string;
    correo: string;
    clave: string;
    legajo: number;
    apellido: string;
    nombre: string;
    sector_id: number;
    vigente? : boolean;
    roles? : string[];
    alta? : string;
    actualizado? : string;
}


