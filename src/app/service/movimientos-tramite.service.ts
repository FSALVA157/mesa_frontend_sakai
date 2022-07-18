import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MovimientoTramiteModel } from '../models/movimiento-tramite.model';

const base_url = environment.URL_BASE

@Injectable({
  providedIn: 'root'
})
export class MovimientosTramiteService {
  movimiento_tramite: MovimientoTramiteModel = new MovimientoTramiteModel;
  constructor(
    private readonly http: HttpClient
  ) { }

  listarHistorialTramite(num_tramite: number){
    return this.http.get<[movimientosTramite:MovimientoTramiteModel[], total: number]>(`${base_url}/movimientos-tramite/historial-tramite/${num_tramite}`)
  }

  listarTramitesPendientes(id_sector: number){
    return this.http.get<[movimientosTramite:MovimientoTramiteModel[], total: number]>(`${base_url}/movimientos-tramite/pendientes?id_sector=${id_sector}`)
  }

  listarTramitesRecibidos(id_sector: number){
    return this.http.get<[movimientosTramite:MovimientoTramiteModel[], total: number]>(`${base_url}/movimientos-tramite/recibidos?id_sector=${id_sector}`)
  }

  listarTramitesEnviados(id_sector: number){
    return this.http.get<[movimientosTramite:MovimientoTramiteModel[], total: number]>(`${base_url}/movimientos-tramite/enviados?id_sector=${id_sector}`)
  }

  guardarMovimientoTramite(data: any){    
    this.movimiento_tramite={...data};
    return this.http.post(`${base_url}/movimientos-tramite`, this.movimiento_tramite);
  }

  recibirMovimientoTramite(data: any, num_mov_anterior:number){    
    this.movimiento_tramite={...data};
    return this.http.post(`${base_url}/movimientos-tramite/recibir-tramite?num_mov_anterior=${num_mov_anterior}`, this.movimiento_tramite);
  }

  salidaMovimientoTramite(num_mov: number, data: any){    
    this.movimiento_tramite={...data};
    console.log("movimiento", this.movimiento_tramite);
    return this.http.put(`${base_url}/movimientos-tramite/tramite-salida?num_movimiento=${num_mov}`, this.movimiento_tramite);
  }
}
