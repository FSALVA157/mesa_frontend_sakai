import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

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
  userToken: string;

  constructor(
    private http: HttpClient
  ) { 
    this.leerToken();
  }

  //INICIAR SESION
  login(usuario: string, clave: string ){
    // delete dataLogin.recuerdame;
    let data:any;
    console.log("url",base_url);
     return this.http.post(
      `${base_url}/auth/login?user=${usuario}&password=${clave}`,
      data
      ).pipe(
        map(resp => {
          this.guardarToken(resp['access_token']);
          return resp;
        })
      );    
  }
  //FIN INICIAR SESION...............................................................

  //GUARDAR TOKEN
  private guardarToken(tokenUsuario: string){
    this.userToken= tokenUsuario;
    localStorage.setItem('token', this.userToken);
  } 
  //FIN GUARDAR TOKEN................................................................

  //LEER TOKEN
  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken= localStorage.getItem('token');
    }
    else{
      this.userToken = "";
    }

    return this.userToken;
  }
  //FIN LEER TOKEN

  listarUsuarios(){
    return this.http.get<[usuarios:IUsuarioModel[], total: number]>(`${base_url}/usuarios/`)
  }

  crearUsuario(data: IUsuarioModel){
    console.log(data);
  }

  //COMPROBAR SI HAY TOKEN
  estaAutenticado(): boolean {
    
    return this.userToken.length > 2;
  }
  //FIN COMPROBAR TOKEN

}
