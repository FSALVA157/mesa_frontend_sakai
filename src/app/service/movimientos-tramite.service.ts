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

  guardarMovimientoTramite(data: any){    
    this.movimiento_tramite={...data};
    return this.http.post(`${base_url}/movimientos-tramite`, this.movimiento_tramite);
  }

  salidaMovimientoTramite(num_mov: number, data: any){    
    this.movimiento_tramite={...data};
    console.log("movimiento", this.movimiento_tramite);
    return this.http.put(`${base_url}/movimientos-tramite/tramite-salida?num_movimiento=${num_mov}`, this.movimiento_tramite);
  }
}
