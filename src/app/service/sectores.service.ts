import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SectorModel } from '../models/sector.model';

const base_url = environment.URL_BASE;

@Injectable({
  providedIn: 'root'
})
export class SectoresService {

  constructor(
    private readonly http: HttpClient
  ) { }

  listarSectores(){
    return this.http.get<SectorModel[]>(`${base_url}/sectores`)
  }

}
