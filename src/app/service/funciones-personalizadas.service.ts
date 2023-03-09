import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesPersonalizadasService {

  constructor() { 
  }

  getCadenaANumero(data: string): number{
    data= data.trim();
    let numero: number = (data !== null && data !== "") ? Number(data) : NaN;

    return numero;
  }
}
