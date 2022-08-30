import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IUsuarioModel } from '../../models/usuario.model';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles:[`
    :host ::ng-deep .p-password input {
    width: 100%;
    padding:1rem;
    }

    :host ::ng-deep .pi-eye{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .pi-eye-slash{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {

  valCheck: string[] = ['remember'];
  form_submitted: boolean = false;
  password: string;
  
  config: AppConfig;
  
  subscription: Subscription;

  //FORMULARIO
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    private usuariosService: UsuariosService,
    private router: Router
    ){ 
      this.loginForm = this.fb.group({
        usuario: [,[Validators.required]],
        clave: ['',Validators.required],
        recuerdame: [false]
      });
    }

  

  ngOnInit(): void {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


   //VALIDACIONES
   isValid(campo: string): boolean{
    if (this.loginForm.get(campo).invalid && this.loginForm.get(campo)?.touched) {
      return true;
    }else{
      return false;
    }
  }
  //FIN VALIDACIONES................................................
  
  //MENSAJES VALIDACIONES
  
  user_validation_messages = {    
    'usuario': [
      { type: 'required', message: 'El correo electronico es requerido.'},
      { type: 'email', message: 'El valor ingresado no es un correo electrónico válido.' },
      
    ],
    'clave': [
      { type: 'required', message: 'El legajo es requerido.'},
      // { type: 'pattern', message: 'El valor ingresado no es un número.' },
      // { type: 'min', message: 'El número ingresado es bajo.(minimo: 1)' },
      // { type: 'max', message: 'El número ingresado es alto (maximo: 500000).'} 
    ]
  }

  //FIN MENSAJES VALIDACIONES...........................................

  //INICIO DE SESION
  login(){

    //VALIDACION DE FORMULARIOS
    if(this.loginForm.invalid){
      Swal.fire('Formulario con errores','Complete correctamente todos los campos del formulario',"warning");
      return Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());
    }

    return this.usuariosService.login(this.loginForm.get('usuario')?.value,this.loginForm.get('clave')?.value)
      .subscribe((respuesta) => {
        this.extraerData(respuesta);
        console.log("respuesta", respuesta);
        Swal.fire({
          title: "Logeo Exitoso",
          text: "Ha ingresado a la Aplicación",
          icon: 'success'                                     
        });
        
        //este codigo modifica una variable global para que el guard permita el acceso
        // globalConstants.validado = true;
        // console.log('EL USUARIO QUE INGRESA TIENE ESTE ROL', globalConstants.rol_usuario);
        
        this.router.navigateByUrl('');
        // if(this.loginForm.get('recuerdame')?.value){
        //   localStorage.setItem('email', this.loginForm.get('correo')?.value);
        // }else{
        //   localStorage.removeItem('email');
        // }
      }, err => {
        Swal.fire({
          title: 'Error Login!',
          text: err.error.message,
          icon: 'error'                                            
        })
        //globalConstants.validado = false;
      });

  }
  //FIN INICIO DE SESION

  extraerData(data: any) {
    //voy a desestructurar respuesta
     //const {id_usuario, apellido, correo, dni, img, nombre, role, destino_id} = data;
     let user: IUsuarioModel= data;
     console.log("EXTRAER DATA USUARIO", user);
    //  user.id_usuario = id_usuario;
    //  user.nombre = nombre;
    //  user.apellido = apellido;
    //  user.correo = correo;
    //  user.img = img;
    //  user.role = role;
    //  user.destino_id = destino_id;
    //  let correoAux: string = "";
    //  if(user.correo){
    //    correoAux= user.correo;
    //  }

    //  globalConstants.urlImagen = user.img!;                                      
    //  globalConstants.nombreUsuario = user.nombre + " " + user.apellido;
    //  globalConstants.inicialesUsuario= user.nombre?.charAt(0).toUpperCase() + "" + user.apellido?.charAt(0).toUpperCase();
    //  globalConstants.emailUsuario = correoAux;
    //  globalConstants.destino_usuario = user.destino_id!;
     
     
    //  this.nombreCortoDestino(user.destino_id!);
    //  globalConstants.rol_usuario = user.role!;
    //  globalConstants.id_usuario = user.id_usuario!;
}

}
