import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RegistroComponent } from './registro/registro.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    PasswordModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule
  ]
})
export class AuthModule { }
