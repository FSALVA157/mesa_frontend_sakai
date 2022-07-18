import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { globalConstants } from 'src/app/common/global-constants';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientosTramiteService } from 'src/app/service/movimientos-tramite.service';

@Component({
  selector: 'app-tramites-recibidos',
  templateUrl: './tramites-recibidos.component.html',  
  providers: [MessageService, ConfirmationService],
  styles: [
  ]
})
export class TramitesRecibidosComponent implements OnInit {

  //para mensajes
  msgs: Message[] = [];
 
  //representatives: Representative[];
  statuses: any[];

  activityValues: number[] = [0, 100];
  idFrozen: boolean = false;

  loading:boolean = true;

  expandedRows = {};
  isExpanded: boolean = false;

  @ViewChild('dt') table: Table;

  @ViewChild('filter') filter: ElementRef;    

  
  //LISTAS    
  //listaTramites: TramiteModel[]=[];
  listSectores: SectorModel[]=[];
  listOrganismos: OrganismoModel[]= [];
  listTiposTramite: TipoTramiteModel[]=[];
  listMovimientosTramite: MovimientoTramiteModel[]=[];
  constructor(
    private movimientosTramiteService: MovimientosTramiteService

  ) { }

  ngOnInit(): void {
    this.listarTramitesRecibidos(globalConstants.sector_usuario);
  }

  //LISTADO MOVIMIENTOS DE TRAMITE
  listarTramitesRecibidos(id_sector: number){ 
    this.expandedRows={};
    if(id_sector){
      this.movimientosTramiteService.listarTramitesRecibidos(id_sector).
      subscribe(respuesta => {
        this.listMovimientosTramite= respuesta[0];  
        this.loading = false;           
      //this.expandedRows[tramite.numero_tramite]=true;
      });
    }     
  }
  //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................


}
