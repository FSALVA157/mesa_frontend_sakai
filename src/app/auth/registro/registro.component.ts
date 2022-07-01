import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
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

  valCheck: string[] = ['remember'];

  password: string;
  
  config: AppConfig;
  
  subscription: Subscription;

  selectedState:any;

  public forma = this.fb.group({
    usuario: ['felipe',[Validators.required]],
    correo:   ['felipe@hotmail.com',[Validators.required]],
    clave1:    ['123456',[Validators.required]],
    clave2:    ['123456',[Validators.required]],
    legajo:   ['1212',[Validators.required]],
    apellido: ['Huanca',[Validators.required]],
    nombre:   ['Felipe',[Validators.required]],
    sector_id:['1',[Validators.required]],
  });
    
    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

  constructor(
    public configService: ConfigService,
    private fb: FormBuilder
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
    console.log(this.forma.value);
  }


}
