import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../service/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private ussuarioService: UsuariosService,
    private router: Router
  ){
    
  }
  canActivate(): boolean {
    console.log("en Guard");
    if(this.ussuarioService.estaAutenticado()){
      return true;
    }
    else{
      this.router.navigateByUrl('/login');
      return false;
    }
    
  }
  
}
