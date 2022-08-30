import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUsuarioModel } from '../models/usuario.model';

const base_url = environment.URL_BASE

interface ILoginData {
  'usuario': string,
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

  login(usuario: string, clave: string ){
    // delete dataLogin.recuerdame;
    let data:any;
    console.log("url",base_url);
     return this.http.post(`${base_url}/auth/login?user=maren&password=123456`,data);    
   }

  listarUsuarios(){
    return this.http.get<[usuarios:IUsuarioModel[], total: number]>(`${base_url}/usuarios/`)
  }

  crearUsuario(data: IUsuarioModel){
    console.log(data);
  }


}
