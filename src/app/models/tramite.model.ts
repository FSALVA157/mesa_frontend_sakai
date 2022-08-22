import { SectorModel } from './sector.model';
import { TipoTramiteModel } from './tipo-tramite.model';
import { IUsuarioModel } from './usuario.model';

export class TramiteModel{
    constructor(
        public id_tramite?: number,
        public numero_tramite?: number,
        public asunto?: string,
        public expediente_nota?: string,
        public persona_referencia?: string,
        public descripcion?: string,
        public fecha?: Date,
        public anio?: number,
        public tipo_tramite_id?: number,
        public tipo_tramite?: TipoTramiteModel,
        public sector_id?: number,
        public sector?: SectorModel,
        public usuario_id?: number,
        public usuario?: IUsuarioModel

    ){}
}