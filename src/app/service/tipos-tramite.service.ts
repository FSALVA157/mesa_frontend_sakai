import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoTramiteModel } from '../models/tipo-tramite.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class TiposTramiteService {

  constructor(
    private http: HttpClient
  ) { }

  //LISTAR TODO
  listarTiposTramite(){
    return this.http.get<TipoTramiteModel[]>(`${base_url}/tipos-tramite`)
  }
  //FIN LISTAR TODO
}
