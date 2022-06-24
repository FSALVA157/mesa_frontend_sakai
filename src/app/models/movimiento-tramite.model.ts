
export class MovimientoTramiteModel{
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
        public sector_id?: number,
        public usuario_id?: number

    ){}
}