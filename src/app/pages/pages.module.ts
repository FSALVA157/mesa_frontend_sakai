import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './../app-routing.module';

import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TramitesPrincipalComponent } from './tramite/tramites-principal/tramites-principal.component';
import { TramitesPendienteComponent } from './tramite/tramites-pendiente/tramites-pendiente.component';
import { TramitesRecibidoComponent } from './tramite/tramites-recibido/tramites-recibido.component';
import { TramitesEnviadoComponent } from './tramite/tramites-enviado/tramites-enviado.component';
import { TramitacionComponent } from './tramitacion/tramitacion.component';
import { MenuService } from '../service/app.menu.service';
import { ConfigService } from '../service/app.config.service';
import { AppComponent } from '../app.component';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TableModule,
    ToolbarModule,
  ],
  declarations: [
    //TramitesComponent,  
    TramitesPrincipalComponent,
    TramitesPendienteComponent,
    TramitesRecibidoComponent,
    TramitesEnviadoComponent,
    TramitacionComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}, MenuService, ConfigService
  ],
  bootstrap: [AppComponent]
  
})
export class PagesModule { }
