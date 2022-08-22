import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TramiteModel } from '../models/tramite.model';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class TramitesService {
  tramite: TramiteModel = new TramiteModel();
  constructor(
    private readonly http: HttpClient
  ) { }

  listarTramites(sector: number){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/tramite-movimientos-sector?id_sector=${sector}`)
  }

  listarTramitesTodos(){
    return this.http.get<[tramite:TramiteModel[], total: number]>(`${base_url}/tramites/tramite-movimientos`)
  }

  guardarTramite(data: Partial<TramiteModel>){    
    this.tramite={...data};
    return this.http.post(`${base_url}/tramites`, this.tramite);
  }
}
