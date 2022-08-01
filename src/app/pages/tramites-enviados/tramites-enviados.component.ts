import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cell, PdfMakeWrapper } from 'pdfmake-wrapper';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientosTramiteService } from 'src/app/service/movimientos-tramite.service';
import { globalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-tramites-enviados',
  templateUrl: './tramites-enviados.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['../../../assets/demo/badges.scss'],
  styles: [
  ]
})
export class TramitesEnviadosComponent implements OnInit {

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

  //VARIABLES MOVIMIENTOS    
  movimientoTramite: MovimientoTramiteModel;
  tramiteInfoDialog: boolean;

  constructor(
    private movimientosTramiteService: MovimientosTramiteService

  ) { }

  ngOnInit(): void {
    this.listarTramitesEnviados(globalConstants.sector.id_sector);
  }

  //LISTADO MOVIMIENTOS DE TRAMITE
  listarTramitesEnviados(id_sector: number){ 
    this.expandedRows={};
    if(id_sector){
      this.movimientosTramiteService.listarTramitesEnviados(id_sector).
      subscribe(respuesta => {
        this.listMovimientosTramite= respuesta[0];  
        this.loading = false;           
      //this.expandedRows[tramite.numero_tramite]=true;
      });
    }     
  }
  //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................

  //OBTENER PLANILLA INTERNO
  generarPdfPase(movimiento: MovimientoTramiteModel) {
    let meses_texto=["Enero", "Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    //fecha completa
    let fecha_hoy: Date = new Date();
    let fecha_completa: string;
    let anio:number= fecha_hoy.getFullYear(); 
    let mes: number= fecha_hoy.getMonth();
    let dia: number= fecha_hoy.getDate();
    fecha_completa = "Salta, " + dia + " de " + meses_texto[mes] + " de " +  anio;

    //fin fecha completa
    const pdf = new PdfMakeWrapper();

    
    
    pdf.create().open();
    //pdf.create().download();
                             
  }
  //FIN OBTENER PLANILLA INTERNO
  //.................................................


  //MANEJO DE  DIALOG INFO
  openDialogInfo(movimiento: MovimientoTramiteModel) {
    this.movimientoTramite = {};
    this.movimientoTramite= movimiento;
    this.tramiteInfoDialog = true;
     
    //this.nuevoTramite=true;
}

hideDialogInfo() {
  this.movimientoTramite={};
    this.tramiteInfoDialog = false;
    //this.nuevoTramite=false;
}    
//FIN MANEJO DIALOG INFO....................................

}
