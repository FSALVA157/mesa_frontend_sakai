import { SectorModel } from './sector.model';
export interface IUsuarioModel{
    id_usuario?: number;
    usuario: string;
    correo: string;
    clave: string;
    legajo: number;
    apellido: string;
    nombre: string;
    vigente? : boolean;
    sector_id: number;
    sector?: SectorModel;    
    roles? : string[];
    alta? : string;
    actualizado? : string;
}



