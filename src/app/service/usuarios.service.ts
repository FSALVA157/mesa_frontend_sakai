import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUsuarioModel } from '../models/usuario.model';

const base_url = environment.URL_BASE

interface ILoginData {
  'correo': string,
  'clave' : string,
  'recuerdame': boolean
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }

  login(dataLogin: ILoginData ){
    // delete dataLogin.recuerdame;
    console.log("url",base_url);
     return this.http.post(`${base_url}/auth/login`, dataLogin);    
   }

  listarUsuarios(){
    return this.http.get<[usuarios:IUsuarioModel[], total: number]>(`${base_url}/usuarios/`)
  }

  crearUsuario(data: IUsuarioModel){
    console.log(data);
  }


}
