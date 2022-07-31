import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MenuService } from '../service/app.menu.service';
import { ConfigService } from '../service/app.config.service';
import { AppComponent } from '../app.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { TramitesPendientesComponent } from './tramites-pendientes/tramites-pendientes.component';
import { TramitesRecibidosComponent } from './tramites-recibidos/tramites-recibidos.component';
import { TramitesEnviadosComponent } from './tramites-enviados/tramites-enviados.component';
import { TramitesPrincipalComponent } from './tramites-principal/tramites-principal.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    TabViewModule,//funciona ng-template
    InputTextareaModule,
    ToolbarModule,

    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    //TramitesComponent,
    TramitesPendientesComponent,
    TramitesRecibidosComponent,
    TramitesEnviadosComponent,
    TramitesPrincipalComponent  
    
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}, MenuService, ConfigService
  ],
  bootstrap: [AppComponent]
  
})
export class PagesModule { }
