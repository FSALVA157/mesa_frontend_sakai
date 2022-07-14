import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }


  crearUsuario(data: IUsuarioModel){
    console.log(data);
  }


}
