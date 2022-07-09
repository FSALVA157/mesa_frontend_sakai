import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  passwordsIguales(clave1ControlName: string, clave2ControlName: string){

    return (formGroup: FormGroup)=> {
        const clave1Control = formGroup.controls[clave1ControlName];
        const clave2Control = formGroup.controls[clave2ControlName];
        if(clave1Control.value === clave2Control.value){
          clave2Control.setErrors(null);
        }else{
          clave2Control.setErrors({
            verificacionFallada: true
          });
        }
    };
  }


}
