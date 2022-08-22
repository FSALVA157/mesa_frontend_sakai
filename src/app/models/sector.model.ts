import { OrganismoModel } from './organismo.model';

export class SectorModel{
    constructor(
        public id_sector?: number,
        public sector?: string,
        public es_mesa_entrada?: boolean,
        public tiene_sistema?: boolean,
        public organismo_id?: number,
        public organismo?: OrganismoModel 

    ){}
}