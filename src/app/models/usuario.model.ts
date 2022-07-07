import { SectorModel } from './sector.model';
import { TipoTramiteModel } from './tipo-tramite.model';

export class UsuarioModel{
    constructor(
        public id_usuario?: number,
        public usuario?: string,
        public correo?: string,
        public clave?: string,
        public legajo?: number,
        public apellido?: string,
        public nombre?: string,
        public vigente?: boolean,
        public sector_id?: number,
        public sector?: SectorModel

    ){}
}