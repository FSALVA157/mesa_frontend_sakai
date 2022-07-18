import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientosTramiteService } from 'src/app/service/movimientos-tramite.service';
import { SectoresService } from 'src/app/service/sectores.service';
import { TiposTramiteService } from 'src/app/service/tipos-tramite.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { globalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-tramites-pendientes',
  templateUrl: './tramites-pendientes.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [
  ]
})
export class TramitesPendientesComponent implements OnInit {

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
    private serviceMensajes: MessageService,
    private tramitesService: TramitesService,
    private movimientosTramiteService: MovimientosTramiteService,
    private sectoresService: SectoresService,
    private tiposTramiteService: TiposTramiteService,
    private fb: FormBuilder
  ) { }

  //FIN CONSTRUCTOR......................................................

  ngOnInit(): void {
    this.listarTramitesPendientes(globalConstants.sector_usuario);

  }
  

  //LISTADO MOVIMIENTOS DE TRAMITE
  listarTramitesPendientes(id_sector: number){ 
    this.expandedRows={};
    if(id_sector){
      this.movimientosTramiteService.listarTramitesPendientes(id_sector).
      subscribe(respuesta => {
        this.listMovimientosTramite= respuesta[0];  
        this.loading = false;           
      //this.expandedRows[tramite.numero_tramite]=true;
      });
    }     
  }
  //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................

}
