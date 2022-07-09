import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidadoresService } from 'src/app/service/validadores.service';
@Component({
  selector: 'app-login',
  templateUrl: './registro.component.html',
  // styleUrls: ['../../../assets/theme/lara-light-indigo/theme.css'],
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
export class RegistroComponent implements OnInit, OnDestroy {

//  valCheck: string[] = ['remember'];

 // password: string;
  
  config: AppConfig;
  
  subscription: Subscription;

  selectedState:any;

  public forma = this.fb.group({
    usuario: ['',[Validators.required, Validators.minLength(5)]],
    correo:   ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    clave1:    ['',[Validators.required,  Validators.minLength(6)]],
    clave2:    ['',[Validators.required,  Validators.minLength(6)]],
    legajo:   ['',[Validators.required]],
    apellido: ['',[Validators.required,  Validators.minLength(2)]],
    nombre:   ['',[Validators.required,  Validators.minLength(2)]],
    sector_id:['name',[Validators.required]],
  }, {
    validators: [this.validatorsService.passwordsIguales('clave1', 'clave2')]
  });

public form_submitted: boolean = false;
    
    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

  constructor(
    public configService: ConfigService,
    private fb: FormBuilder,
    private validatorsService: ValidadoresService
    ){ }

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

  crearUsuario(){
      this.form_submitted = true;
      if(this.forma.valid){
        console.log('posteando data');
      }else{
        console.log('formulario no válido');
      }
  }

  isValid(campo: string): boolean{
    if (this.forma.get(campo).invalid && this.form_submitted) {
      return true;
    }else{
      return false;
    }
  }

  clavesValidation(): boolean{
    return ((this.forma.get('clave1').value === this.forma.get('clave2').value))?  false: true;
        
  }
}
