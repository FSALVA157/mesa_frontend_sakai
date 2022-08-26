import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cell, Table as TablaPdf, PdfMakeWrapper, Img, Txt, Canvas, Rect, Polyline, Ellipse, Line } from 'pdfmake-wrapper';
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
  //TEMPORAL
  sector: SectorModel;

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
    private movimientosTramiteService: MovimientosTramiteService,
    public readonly datePipe: DatePipe,

  ) { 
    this.sector = globalConstants.sector;
  }

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

  //OBTENER PASE
  async generarPdfPase(movimiento: MovimientoTramiteModel) {
    let meses_texto=["Enero", "Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    //fecha completa
    let fecha_hoy: Date = new Date();
    let fecha_completa: string;
    let fecha: string;
    let anio:number= fecha_hoy.getFullYear(); 
    let mes: number= fecha_hoy.getMonth();
    let dia: number= fecha_hoy.getDate();
    fecha_completa = "Salta, " + dia + " de " + meses_texto[mes] + " de " +  anio;
    
    //fin fecha completa
    const pdf = new PdfMakeWrapper();
    //Margenes [mL,mT,mR,mB]
    pdf.pageMargins([55,65,85,0]);

    //Rectangulos
    pdf.add(
      new Canvas([
        // Bottom
        new Rect([45, 60], [460, 155]).lineColor('#000000').end,
        new Rect([45, 215], [460, 70]).lineColor('#000000').end,
        
      ]).absolutePosition(0, 0).end
    );
    
       
    //Encabezado
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt(this.movimientoTramite.sector.organismo.organismo.toUpperCase() + " S.P.P.S").bold().fontSize(14).alignment('left').end).end,
          new Cell (new Txt(this.datePipe.transform(this.movimientoTramite.fecha_salida, "dd/MM/yyyy")).fontSize(11).alignment("right").end).end
        ],
        [
          new Cell (new Txt(this.movimientoTramite.sector.sector.toUpperCase() + " S.P.P.S").bold().fontSize(11).alignment('left').end).end,
          new Cell (new Txt(" ").bold().fontSize(13).alignment('left').end).end
        ]        

      ]).widths([365,70]).layout("noBorders").end
    );

    //Referencia
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Ref.").fontSize(12).alignment('left').end).end,
          new Cell (new Txt(this.movimientoTramite.descripcion_ingreso).fontSize(10).alignment("left").end).end
        ]       

      ]).widths([30,405]).heights([60]).layout("noBorders").end
    );

    //Conocimiento
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Tomado Conocimiento y por Corresp. PASE A:").fontSize(11).alignment('left').end).end,
          
        ],
        [
          new Cell (new Txt(this.movimientoTramite.sector_destino.sector.toUpperCase() +" - "+ this.movimientoTramite.sector_destino.organismo.organismo.toUpperCase()).bold().fontSize(11).alignment("left").end).margin([20,0,0,0]).end
        ]       

      ]).widths([430]).heights([10,25]).layout("noBorders").end
    );
    
    //Para
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Para: ").fontSize(12).alignment('left').end).end,
          new Cell (new Txt(this.movimientoTramite.descripcion_salida).fontSize(10).alignment("left").end).end
        ],
        [
          new Cell (new Txt(" ").fontSize(11).alignment('left').end).end,
          new Cell (new Txt("Tramite: " + this.movimientoTramite.tramite_numero +"-"+ this.movimientoTramite.num_movimiento_tramite +"-"+ this.movimientoTramite.tramite.anio).bold().fontSize(12).alignment("left").end).end
        ]


      ]).widths([30,400]).heights([50,15]).margin([0,0,0,0]).layout("noBorders").end
    );
    
    
    pdf.create().open();
    //pdf.create().download();
                             
  }
  //FIN OBTENER PASE
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

   //LIMPIAR
   clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR  

}
