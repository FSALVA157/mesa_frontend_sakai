import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RegistroComponent } from './registro/registro.component';
//import { AppModule } from '../app.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent    
  ],
  imports: [
    CommonModule,
    //AppModule,
    PasswordModule,
  CheckboxModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule 
  ]
})
export class AuthModule { }
