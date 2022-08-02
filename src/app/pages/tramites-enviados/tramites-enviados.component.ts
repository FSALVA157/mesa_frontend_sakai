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

  //OBTENER PASE
  async generarPdfPase(movimiento: MovimientoTramiteModel) {
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
    //[mL,mT,mR,mB]
    pdf.pageMargins([50,50,75,0]);

    pdf.add(
      new Canvas([
        // Bottom
        new Rect([40, 40], [500, 150]).lineColor('#000000').end,
        new Rect([40, 190], [500, 100]).lineColor('#000000').end,
        // Top
        // new Polyline([
        //   { x: 597, y: 0 },
        //   { x: 597, y: 300 },
        //   { x: 0, y: 0 },
        // ])
        //   .closePath()
        //   .color('#2E8BC0')
        //   .lineColor('#2E8BC0').end,
  
        // new Polyline([
        //   { x: 0, y: 0 },
        //   { x: 0, y: 845 },
        //   { x: 597, y: 0 },
        // ])
        //   .closePath()
        //   .color('#0C2D48')
        //   .lineColor('#0C2D48').end,
  
        // // circle
        // new Ellipse([100, 90], 50).color('#145DA0').end,
  
        // // Title line
        // new Line([200, 745], [540, 745]).lineWidth(8).lineCap('round').end,
      ]).absolutePosition(0, 0).end
    );
    
    // pdf.add(
    //   new TablaPdf([
    //     [ 
    //       new Cell (await new Img('../../../../assets/img/logo-spps-transp-text.png').fit([130,130]).alignment('left').build()).end
    //     ],
    //     [ 
    //       new Txt(this.movimientoTramite.sector.organismo.organismo.toUpperCase()).fontSize(9).alignment('center').end
          
    //     ]
    //   ]).widths([130])
    //   .layout('noBorders').end
    // );
    // pdf.add(' ');
    
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt(this.movimientoTramite.sector.organismo.organismo.toUpperCase() + " S.P.P.S").bold().fontSize(12).alignment('left').end).end,
          new Cell (new Txt("05/10/2022").fontSize(11).alignment("right").end).end
        ]       

      ]).widths([360,100]).layout("headerLineOnly").end
    );

    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Ref.").fontSize(11).alignment('left').end).end,
          new Cell (new Txt(this.movimientoTramite.descripcion_ingreso).fontSize(10).alignment("left").end).margin(0).end
        ]       

      ]).widths([25,442]).heights([70]).layout("noBorders").end
    );

    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Tomado Conocimiento y por Corresp. PASE A:").fontSize(11).alignment('left').end).end,
          
        ],
        [
          new Cell (new Txt(this.movimientoTramite.sector_destino.sector.toUpperCase() +" - "+ this.movimientoTramite.sector_destino.organismo.organismo.toUpperCase()).bold().fontSize(11).alignment("left").end).margin([20,0,0,0]).end
        ]       

      ]).widths([460]).layout("noBorders").end
    );
    
    pdf.add(
      new TablaPdf([
        [
          new Cell (new Txt("Para: ").fontSize(11).alignment('left').end).end,
          new Cell (new Txt(this.movimientoTramite.descripcion_salida).fontSize(10).alignment("left").end).end
        ],
        [
          new Cell (new Txt(" ").fontSize(11).alignment('left').end).end,
          new Cell (new Txt(this.movimientoTramite.tramite_numero +"-"+ this.movimientoTramite.num_movimiento_tramite).bold().fontSize(12).alignment("left").end).end
        ]


      ]).widths([25,442]).heights([40]).margin([0,20,0,0]).layout("noBorders").end
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

}
