import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TramitesPrincipalComponent } from './tramite/tramites-principal/tramites-principal.component';
import { TramitesPendienteComponent } from './tramite/tramites-pendiente/tramites-pendiente.component';
import { TramitesRecibidoComponent } from './tramite/tramites-recibido/tramites-recibido.component';
import { TramitesEnviadoComponent } from './tramite/tramites-enviado/tramites-enviado.component';



@NgModule({
  declarations: [
    //TramitesComponent,  
    TramitesPrincipalComponent,
    TramitesPendienteComponent,
    TramitesRecibidoComponent,
    TramitesEnviadoComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TableModule,
    ToolbarModule,
  ]
})
export class PagesModule { }
