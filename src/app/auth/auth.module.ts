import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RegistroComponent } from './registro/registro.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent    
  ],
  imports: [
    CommonModule,
    PasswordModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    DropdownModule    
  ]
})
export class AuthModule { }
