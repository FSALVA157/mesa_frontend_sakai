import { SectorModel } from './sector.model';
import { TramiteModel } from './tramite.model';
import { IUsuarioModel } from './usuario.model';

export class MovimientoTramiteModel{
    constructor(
        public id_movimiento_tramite?: number,
        public num_movimiento_tramite?: number,
        public tramite_numero?: number,        
        public tramite?: TramiteModel,
        public sector_origen_id?: number,
        public sector_origen?: SectorModel,
        public fecha_ingreso?: Date,
        public fojas_ingreso?: number,
        public descripcion_ingreso?: string,
        public sector_destino_id?: number,
        public sector_destino?: SectorModel,
        public fecha_salida?: Date,
        public fojas_salida?: number,
        public descripcion_salida?: string,
        public enviado?: boolean,
        public recibido_destino?: boolean,
        public impreso?: boolean,
        public sector_id?: number,
        public sector?: SectorModel,
        public usuario_id?: number,
        public usuario?: IUsuarioModel

    ){}
}